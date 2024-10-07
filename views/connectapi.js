
const BASE_URL = 'http://localhost:3000/api';
// Create a new URL object
const url = new URL(window.location.href);

// Get the page parameter
let page = parseInt(url.searchParams.get('page'), 10) || 1; // Default to 1 if not present
// Get queryParams
const queryParams = {};

function updateQueryParam(url) {
    url.searchParams?.forEach((value, key) => {
        queryParams[key] = value;
    });
}
updateQueryParam(url)
// Check if user is logged in
const authStatus = window.localStorage.getItem('authStatus') || null;

class HttpError extends Error {
    constructor(status, statusText) {
        super(`${status} ${statusText}`);
        this.status = status;
        this.statusText = statusText;
    }
}

/**
 * // Function to GET endpoint
 * @param {string} url 
 * @returns promise
 */
const getAPI = async (url) => {
    try {
        const res = await fetch(url, {
            method: 'GET',
            // headers: {
            //     Authorization: `Bearer ${token}`,
            // },
            // credentials: 'include'
        });

        if (!res.ok) {
            return res.json().then(errorData => {
                throw new HttpError(res.status, errorData.message);
            });
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch api', error);
    }
};
/**
 * base for POST Endpoint
 * @param {string} url 
 * @param {Object} senddata 
 * @returns promise
 */
const postAPI = async (url, senddata) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            // must specify content-type if you used express.urlencoded() middleware
            'Content-Type': 'application/json',
        },
        // credentials: 'include',
        body: JSON.stringify(senddata),
    });

    if (!res.ok) {
        return res.json().then(errorData => {
            throw new HttpError(res.status, errorData.message);
        });
    }

    const data = await res.json();
    return data;
};

/**
 * @param {string} setNav login || null
 * Set navbar button login,signup/logout
 */
const addElement = (elementId, elementInnerHtml) => {
    const holderContainer = document.getElementById(elementId);
    holderContainer.innerHTML = elementInnerHtml
}
const setNavBar = async (setNav) => {
    if (setNav === 'login') {
        localStorage.removeItem('authStatus');
        const elemmentHTML = `
            <a type="button" class="btn btn-outline-primary me-2" href="../login/index.html">Login</a>
            <a type="button" class="btn btn-primary" href="../signup/index.html">Sign-up</a>
            `
        addElement('nav-btn-display', elemmentHTML)
        // await getAPI(`${BASE_URL}/user/logout`)
    } else {
        elemmentHTML = `<a id="logoutUser" type="button" class="btn btn-outline-warning me-2" href="../login/index.html">LogOut</a>`
        addElement('nav-btn-display', elemmentHTML)
        document.getElementById('logoutUser').addEventListener('click', logoutUserClick);
    }

};
/**
 * @param {object} data 
 * @returns promise for add or remove items
 */
const toggleFaListApi = async (data) => {
    return postAPI(`${BASE_URL}/products/addtolist`, data)
};
// Log Out
async function logoutUserClick(event) {
    event?.preventDefault(); // Prevent page reload
    try {
        const logoutUser = await getAPI(`${BASE_URL}/user/logout`)
        setNavBar('login')
        window.location.href = '../login/index.html'
    } catch (error) {
        popupErrorSwal(error.message)
    }
}

const getCurrentUser = async () => {
    if (authStatus === 'logged') {
        try {
            const getme = await getAPI(`${BASE_URL}/user/me`)
            if (getme) {
                favoriteIds = getme.favoriteIds
 
                setNavBar()
                setFavoritesOrAdminAccess(getme.isAdmin, getme.favorites)
            } else {
                setNavBar('login')
            }
            return getme
        } catch (error) {
            popupErrorSwal(error.message)
            localStorage.removeItem('authStatus');
            window.location.reload()
        }

    } else {
        setNavBar('login')
    }
}

const setFavoritesOrAdminAccess = (admin, favoritesLists) => {
    if (admin) {
        //show admin access link page
        let setElement = `<a href="../admin/index.html" class="nav-link px-2">Admin</a>`
        addElement('adminpage', setElement)
    } else {
        //show favorites sidebar
        let setElement = `<a href="../profile/index.html" class="nav-link px-2">Profile</a>`
        addElement('adminpage', setElement)
        setFavoritesList(favoritesLists)
    }
}


const setFavoritesList = (favoritesLists, elementId = 'nav-favorites-list') => {
    const showbtn = elementId === 'nav-favorites-list' || elementId === 'nav-favorites-list-profile'
    let setElement = `<button class="btn btn-info dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown"
            aria-expanded="false">
            Favorites Lists
          </button>`
    let listsDetail = favoritesLists.map(product => {
        return `
            <div class="dropdown-item d-flex flex-row bd-highlight mb-3">
                <img src="${product.pictureUrl}" alt="${product.name}" class="img-fluid img-selecte" id="${product._id}">
                <p>$200</p>
                ${(!showbtn) ? `` : `<button class="btn btn-outline-danger btn-sm btn-remove" id="${product._id}" >Remove</button>`
            }
            </div>
            `
    }).join('')
    if (listsDetail) {
        listsDetail = `
            <div class="dropdown-menu favorite-sidebar-menu" aria-labelledby="dropdownMenuButton1" id="sideBarList">
            ${listsDetail}
            </div>
            `
    } else {
        listsDetail = `
            <div class="dropdown-menu no-product-sidebar" aria-labelledby="dropdownMenuButton1" id="sideBarList">
                <div>No Product Found</div>
            </div>
            `
    }
    setElement += listsDetail
    addElement(elementId, setElement)
    if (!showbtn) return
    document.getElementById('sideBarList').addEventListener('click', async (event) => {
        event.preventDefault();
        const targetEle = event.target.tagName
        if (targetEle === 'BUTTON') {
            const productId = event.target.id
            AddOrNotSwal(productId)
        }
    });
}

//=== Pop up
const popupErrorSwal = (error = "Something went wrong!") => {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
    });
}

const SuccessSwal = (message = "LogIn Success", NoRedirect) => {
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: message,
        showConfirmButton: false,
        timer: 1000
    }).then(() => {
        if (!NoRedirect)
            window.location.href = '../home/index.html?page=1'
    });
}

const AddOrNotSwal = (productId, comfirmText = 'delete') => {
    Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Yes, ${comfirmText} it!`
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await toggleFaListApi({ productId })
                if (window.location.href.includes('/profile/')) {
                    setFavoritesList(res.favorites, `nav-favorites-list-profile`)
                } else {
                    favoriteIds = res.favoriteIds.join(',')
                    if(productId === queryParams.productId){
                        // in case delete from FL and update on detail
                        updateProduct(res.product)
                    }
                    setFavoritesList(res.favorites)
                }
                Swal.fire({
                    title: "Deleted!",
                    text: comfirmText,
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1000
                });
            } catch (error) {
                popupErrorSwal(error.message)
            }

        }
    });
}
//=== Pop up


const notAllow = ()=>{
    let timerInterval;
    Swal.fire({
    icon: "error",
    title: "You don't have permission.",
    html: "<h4>Will redirect to in <b></b> milliseconds.</h4>",
    width: 3000,
    timer: 2000,
    timerProgressBar: true,
    didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
        timer.textContent = `${Swal.getTimerLeft()}`;
        }, 100);
    },
    willClose: () => {
        clearInterval(timerInterval);
    }
    }).then((result) => {
    /* Read more about handling dismissals below */
        window.location.href = '../home/index.html'
    if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
    }
    });
}

// add footer
(() => {
    setElement = `
     <div class="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
          <p>© 2024 Company, Inc. All rights reserved.</p>
          <ul class="list-unstyled d-flex">
            <li class="ms-3"><a class="link-body-emphasis" href="#"><svg class="bi" width="24" height="24"><use xlink:href="#twitter"></use></svg></a></li>
            <li class="ms-3"><a class="link-body-emphasis" href="#"><svg class="bi" width="24" height="24"><use xlink:href="#instagram"></use></svg></a></li>
            <li class="ms-3"><a class="link-body-emphasis" href="#"><svg class="bi" width="24" height="24"><use xlink:href="#facebook"></use></svg></a></li>
          </ul>
    </div>
    `
    addElement('footer', setElement)
})()
// some element
const notFoundElement = `<h2>There aren't any items available.</h2>`
const foundNothingId = 'found-nothing'
// addElement(foundNothingId, notFoundElement)

const adminCheck$ = getCurrentUser()
