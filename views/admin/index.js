// prevent access if not admin check
adminCheck$.then(getme => {
    if (getme && getme?.isAdmin) {
        getUsers()
    }
    else {
        // throw new Error()
        // addElement('userlists', '')
        // notAllow()

        window.location.href = '../notfound/index.html'
    }
}).catch(error => {
    console.log(error)
    window.location.href = '../notfound/index.html'
})
let currentPage = 1;
let totalPages = 1;
const perPage = 6;
let userlistsData = [];
const getUsers = async () => {
    try {
        const userlist = await getAPI(`${BASE_URL}/user/admin`)
        userlistsData = [...userlist.users]
        totalPages = Math.ceil(userlist.length / perPage)
        showUserList(userlistsData.slice((currentPage - 1) * perPage, currentPage * perPage))
        generatePagination(currentPage, totalPages);
    } catch (error) {
        addElement('userlists', notFoundElement)
        popupErrorSwal(error)
    }
};

const showUserList = (users) => {
    let Element = users.map(user => {
        return `
            <div class="col">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <div id="nav-favorites-lis-${user._id}" class=" card-title dropdown float-end">
                            <a href="#" class="btn btn-primary">Go somewhere</a>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">User Detail</h5>
                            <p class="card-text">Email: ${user.email}</p>
                            <p class="card-text">Username: ${user.username}</p>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        `
    }).join('')

    addElement('userlists', Element)
    users.forEach(element => {
        setFavoritesList(element.favorites, `nav-favorites-lis-${element._id}`)
    });
}



const generatePagination = (currentPage, totalPages) => {
    let paginationHTML = '';

    // Create "Previous" button
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="event.preventDefault(); if (currentPage > 1) { prevPage(); }">
                Previous
            </a>
        </li>
    `;

    // Create page number items
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        paginationHTML += `
            <li class="page-item ${pageNum === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="event.preventDefault(); goToPage(${pageNum});">
                    ${pageNum}
                </a>
            </li>
        `;
    }

    // Create "Next" button
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="event.preventDefault(); if (currentPage < ${totalPages}) { nextPage(); }">
                Next
            </a>
        </li>
    `;

    addElement('pagination', paginationHTML)

};

const goToPage = (pageNum) => {
    currentPage = pageNum;
    generatePagination(currentPage, totalPages);
    showUserList(userlistsData.slice((currentPage - 1) * perPage, currentPage * perPage))
};

const add = (increment) => {
    return () => {
        currentPage += increment;
        if (currentPage < 1) currentPage = 1;
        if (currentPage > totalPages) currentPage = totalPages;
        generatePagination(currentPage, totalPages);
        showUserList(userlistsData.slice((currentPage - 1) * perPage, currentPage * perPage))
    }
};

const nextPage = add(1); // Function to go to the next page
const prevPage = add(-1); // Function to go to the previous page

// Initial call to generate pagination

