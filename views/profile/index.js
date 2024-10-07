adminCheck$.then(getme => {
    if (getme && !getme.isAdmin) {
        const userdetail = getme
        //remove nav
        addElement('nav-favorites-list', '')
        showUserList(userdetail)
    }
    else {
        // addElement('userlists', '')
        // notAllow()

        window.location.href = '../notfound/index.html'
    }
})

const showUserList =(user)=>{
    let Element =  `
            <div class="col">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <div id="nav-favorites-list-profile" class=" card-title dropdown float-end">
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
    addElement('userlists', Element)
    setFavoritesList(user.favorites, `nav-favorites-list-profile`)
}