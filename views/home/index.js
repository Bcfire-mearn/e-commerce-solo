
// set fillter
(() => {
    const array = [
        { id: 'type1', label: 'Type 1' },
        { id: 'type2', label: 'Type 2' },
        { id: 'type3', label: 'Type 3' },

        { id: 'brand1', label: 'Brand 1' },
        { id: 'brand2', label: 'Brand 2' },
        { id: 'brand3', label: 'Brand 3' },
        { id: 'brand4', label: 'Brand 4' },
        { id: 'brand5', label: 'Brand 5' },
        { id: 'brand6', label: 'Brand 6' },
    ]
    fillterElement = array.map(each => {
        return `
        <div>
            <input type="checkbox" id="${each.id}" autocomplete="off">
            <label for="${each.id}">${each.label}</label>
        </div>
        `;
    }).join('');
    addElement('typeBrandCheck', fillterElement)

})()

// Function to fetch products
const getProduct = async (page, queryTypeBrand) => {
    const baseUrl = `${BASE_URL}/products?page=${page}` + (queryTypeBrand ? queryTypeBrand : '')
    return getAPI(baseUrl)
};

// Function to update the product list
const updateProductList = (data) => {
    const products = data?.products
    let setElement = ''
    if (!products || products.length === 0) {
        setElement = `<div class="col-8">There aren't any items available.</div>`
    } else{
        setElement = products.map(product => {
        return `
            <div class="col">
              <div class="card shadow-sm">
                <div class="card-body">
                    <img src="${product.pictureUrl}" alt="${product.name}" id="${product._id}" class="img-fluid maxheight img-selecte">
                    <p>$200</p>
                </div>
                </div>
            </div>
        `
    }).join('')}
    addElement('product-list', setElement)
};

// Function to handle pagination
const generatePagination = (currentPage, totalPages) => {
    let paginationHTML = '';
    // Create "Previous" button
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="event.preventDefault(); if (${currentPage} > 1) { page--; loadProducts(page); }">
                Previous
            </a>
        </li>
    `;

    // Create page number items
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        paginationHTML += `
            <li class="page-item ${pageNum === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="event.preventDefault(); page = ${pageNum}; loadProducts(page);">
                    ${pageNum}
                </a>
            </li>
        `;
    }

    // Create "Next" button
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="event.preventDefault(); if (${currentPage} < ${totalPages}) { page++; loadProducts(page); }">
                Next
            </a>
        </li>
    `;

    addElement('pagination', paginationHTML)

};

// Function to load products and pagination
const loadProducts = async (page) => {
    const updateurl = new URL(window.location.href);
    updateQueryParam(updateurl)
    const queryTypeBrand = `&type=${queryParams.type ? queryParams.type : ''}&brand=${queryParams.brand ? queryParams.brand : ''}`

    try {
        const data = await getProduct(page, queryTypeBrand);
        updateProductList(data); // Update product list with new data
        const totalPages = data.totalPages || 1; // Replace with actual total pages from API response
        generatePagination(page, totalPages);
        // Append or update the 'page' and 'type' query parameters
        // updateurl.searchParams.delete('page');
        updateurl.searchParams.set('page', page);
        // updateurl.searchParams.set('type', queryParams?.type);
        // updateurl.searchParams.set('brand', queryParams?.brand);
        const checkboxId = [
            ...((queryParams?.type || '').split(';')),
            ...((queryParams?.brand || '').split(';'))
        ];
        checkboxId?.forEach(each => {
            const checkbox = document.getElementById(each);
            if (checkbox)
                checkbox.checked = true;
        })

        let finalUrl = updateurl.toString().replace(/%3B/g, ';');
        // // Update the URL without reloading the page
        window.history.pushState({}, '', finalUrl);
    } catch (error) {
        addElement('product-list', notFoundElement)
        popupErrorSwal(error.message)
    }
};


function getCheckedValues() {
    // Select the container that holds the checkboxes
    const container = document.getElementById('typeBrandCheck');
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    const checkedValuesType = [];
    const checkedValuesBrand = [];

    // Loop through each checkbox and check if it's checked
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            // Find the label associated with the checkbox and get its text content
            const label = container.querySelector(`label[for="${checkbox.id}"]`).textContent;
            if (label.includes('Type')) {
                checkedValuesType.push(label.toLowerCase().replace(/\s+/g, ''));
            } else {
                checkedValuesBrand.push(label.toLowerCase().replace(/\s+/g, ''));
            }
        }
    });
    const url = new URL(window.location.href);
    //delete last search
    url.searchParams.delete('page')
    url.searchParams.delete('type')
    url.searchParams.delete('brand')
    // Append or update the 'page' and 'type' query parameters
    // resst to page 1
    page = 1
    url.searchParams.set('page', page);
    url.searchParams.set('type', checkedValuesType.join(';'));
    url.searchParams.set('brand', checkedValuesBrand.join(';'));

    let finalUrl = url.toString().replace(/%3B/g, ';');
    // // Update the URL without reloading the page
    window.history.pushState({}, '', finalUrl);
    // const updateurl = new URL(window.location.href);
    // const queryParams = {};
    // // Iterate over all query parameters and add them to the object
    // updateurl.searchParams?.forEach((value, key) => {
    //     queryParams[key] = value;
    // });

    // const queryTypeBrand = `&type=${queryParams.type?queryParams.type:''}&brand=${queryParams.brand?queryParams.brand:''}`
    const queryTypeBrand = `&type=${checkedValuesType.join(';')}&brand=${checkedValuesBrand.join(';')}`
    loadProducts(page, queryTypeBrand)
}

function unCheck() {
    const array = [
        { id: 'type1', label: 'Type 1' },
        { id: 'type2', label: 'Type 2' },
        { id: 'type3', label: 'Type 3' },

        { id: 'brand1', label: 'Brand 1' },
        { id: 'brand2', label: 'Brand 2' },
        { id: 'brand3', label: 'Brand 3' },
        { id: 'brand4', label: 'Brand 4' },
        { id: 'brand5', label: 'Brand 5' },
        { id: 'brand6', label: 'Brand 6' },
    ]
    array.forEach(each => {
        const checkbox = document.getElementById(each.id);
        checkbox.checked = false;
    })
}


// Click img to navigate to product page
document.getElementById('product-list').addEventListener('click', (event) => {
    event.preventDefault();
    const targetImg = event.target.tagName
    if (targetImg === 'IMG') {
        const targetId = event.target.id
        window.location.href = '../product/index.html' + '?productId=' + targetId
    }
});

// Initial load
loadProducts(page);