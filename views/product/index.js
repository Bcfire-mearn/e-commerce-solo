// Function to fetch products
const getProductById = async (productId,) => {
    const baseUrl = `${BASE_URL}/products/details/${productId}`
    return getAPI(baseUrl)
};
let favoriteIds = ''
let isAdmin = false
const updateProduct = async (product) => {
    let productElement =
        `
        <div class="d-flex justify-content-between">
            <div><img src="${product?.pictureUrl}" alt="${product?.name}" id="${product?._id}" class="img-fluid product-maxheight ${product?._id}"></div>
            <p class="p-product">Price: $${product?.price}
                ${ isAdmin ?'': authStatus ? `<button class="btn btn-outline${favoriteIds.includes(product?._id) ? '-danger' : '-primary'} ${product?._id}" id="btnfavorite">
                    ${favoriteIds.includes(product?._id) ? 'Remove' : 'Addme💖'} 
                    </button>`
            : `<a href="../login/index.html" class="btn btn-outline-secondary" id="needLogIn">Login to add</a>`
        }
                
            </p>
            <p class="p-product">Description:${product?.description}</p>
        </div>   
    `
    addElement('main-item', productElement)
    if (authStatus && !isAdmin) {
        document.getElementById('btnfavorite').addEventListener('click', handleFavoriteClick);
    }

};

const similarProducts = (otherProducts) => {
    otherproductElement = otherProducts.map(product => {
        return `
            <div class="d-flex each-product btn btn-outline-info ${queryParams?.productId === product._id ? 'active' : ''}" id="${product._id}">
                <img src="${product.pictureUrl}" alt="${product.name}" class="img-fluid product-maxheight img-selecte">
                <p class="p-product">Price: $${product.price}</p>
            </div>
        `
    })
    addElement('other-item', otherproductElement)

}
let productData = {};
const loadProducts = async () => {
    try {
        const product = await getProductById(queryParams.productId)
        // Store the product data for later use
        productData.product = product.product;
        productData.otherProduct = product.otherProduct;
        // load favoriteIds before send updateP
        await adminCheck$.then(user => {
            if (user) {
                favoriteIds = user.favoriteIds.join(',')
                isAdmin = user.isAdmin
            }
        })
        updateProduct(product.product)
        similarProducts(product.otherProduct)
    } catch (error) {
        addElement(foundNothingId, notFoundElement)
        popupErrorSwal(error)
    }

}

loadProducts()

// Click img to navigate to product page
document.getElementById('other-item').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent page reload
    const activeItem = document.querySelector('#other-item .active');
    if (activeItem) {
        activeItem.classList.remove('active'); // Remove the 'active' class
    }
    // Check if the clicked element or its parent is the product div
    const target = event.target.closest('.each-product');

    if (target) {
        target.classList.add('active')
        const productId = target.id; // Get the ID of the clicked product
        const clickedProduct = productData.otherProduct.find(product => product._id === productId);
        const updateurl = new URL(window.location.href);


        if (clickedProduct) {
            updateurl.searchParams.set('productId', clickedProduct._id);
            window.history.pushState({}, '', updateurl.toString());
            updateProduct(clickedProduct)
            updateQueryParam(updateurl)
        }
    }
});

// Function to handle the favorite button click
async function handleFavoriteClick(event) {
    event.preventDefault(); // Prevent page reload

    const target = event.target;
    if (target) {
        const productId = target.className.split(' ').slice(-1)[0]
        try {
            const res = await toggleFaListApi({ productId })
            //update list id before call update
            favoriteIds = res.favoriteIds.join(',')
            updateProduct(res.product)
            // add this id to list
            setFavoritesList(res.favorites)
            SuccessSwal(res.message, 'nono')
        } catch (error) {
            popupErrorSwal(error)
        }

    }
}
