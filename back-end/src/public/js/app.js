const categoryEl = document.getElementById('category');
const urlParams = new URLSearchParams(window.location.search);

const sortOptions = ['all_clothing', 'ex_clothing', 'cheap_clothing', 'latest_clothing'];

let page = urlParams.get('page');

if (
  !page &&
  (window.location.href.includes("/product") ||
    window.location.href.includes("/womenProduct") ||
    window.location.href.includes("/childrenProduct")) &&
    (window.location.href.match(/\//g) || []).length === 3
) {
  if (urlParams.size === 0) {
    window.location.href = `?page=1`;
  } else {
    window.location.href = `${window.location.href}&page=1`;
  }
}
let sort = urlParams.get('sort') || 'all_clothing';
let minPrice = urlParams.get('min');
let maxPrice = urlParams.get('max');
let size = urlParams.get('size');
let rangeValue = `${minPrice || 0},${maxPrice || ''}`;

let elePrice = document.getElementsByName("price");
for(let i=0;i<elePrice.length;i++) {
    if(elePrice[i].value === `${minPrice || 0},${maxPrice || ''}`) {
        elePrice[i].checked = true;
    }
}

let eleSize = document.getElementsByName("size");
for(let i=0;i<eleSize.length;i++) {
    if(eleSize[i].value === `${size}`) {
        eleSize[i].checked = true;
    }
}

const selectedIx = sortOptions.findIndex(el => el === sort);

if(categoryEl) {
    categoryEl.selectedIndex = selectedIx;
    categoryEl.onchange = (e) => {
       if(!window.location.href.includes('?')) {
           if(window.location.href.includes(`sort=${sort}`)) {
            window.location.href = window.location.href.replace(`sort=${sort}`, `sort=${e.target.value}`);
           } else {
               window.location.href = `?sort=${e.target.value}`
           }
       } else {
        if(window.location.href.includes(`sort=${sort}`)) {
            window.location.href = window.location.href.replace(`sort=${sort}`, `sort=${e.target.value}`);
        } else {
            window.location.href = `${window.location.href}&sort=${e.target.value}`
        }
       }
    
       sort = e.target.value;
    
       categoryEl.selected = e.target.value;
    }
}


const handleChangePriceRange = (e, min, max) => {
    let newHref = window.location.href;
    if(e.checked) {
        if(min) {
            if(newHref.includes(`min=${minPrice}`)) {
                newHref = newHref.replace(`min=${minPrice}`, `min=${min}`)
            } else if(newHref.includes('?')) {
                newHref = `${newHref}&min=${min}`
            } else {
                newHref = `${newHref}?min=${min}`
            }
            minPrice = min;
        } else {
            newHref = newHref.replace(`&min=${minPrice}`, ``)
            newHref = newHref.replace(`?min=${minPrice}`, ``)
        }

        if(max) {
            if(newHref.includes(`max=${maxPrice}`)) {
                newHref = newHref.replace(`max=${maxPrice}`, `max=${max}`)
            } else if(newHref.includes('?')) {
                newHref = `${newHref}&max=${max}`
            } else {
                newHref = `${newHref}?max=${max}`
            }
            maxPrice = max;
        } else {
            newHref = newHref.replace(`&max=${maxPrice}`, ``)
            newHref = newHref.replace(`?max=${maxPrice}`, ``)
        }
        window.location.href = newHref;
        rangeValue = e.value;
    } else {
        if(newHref.includes(`max=${maxPrice}`)) {
            if(urlParams.size === 1) {
                newHref = newHref.replace(`?max=${maxPrice}`, '');
            } else {
                newHref = newHref.replace(`&max=${maxPrice}`, '');
            }
        }

        if(newHref.includes(`min=${minPrice}`)) {
            const params = new URLSearchParams(newHref);
            if(params.size === 1) {
                newHref = newHref.replace(`?min=${minPrice}`, '');
            } else {
                newHref = newHref.replace(`&min=${minPrice}`, '');
            }
        }

        window.location.href = newHref;
    }
}

const handleUnSelectPrice = (e) => {
    let newHref = window.location.href;
    if(e.value === rangeValue) {
        let ele = document.getElementsByName("price");
        for(let i=0;i<ele.length;i++) {
            ele[i].checked = false;
        }
        rangeValue = null;

        if(newHref.includes(`max=${maxPrice}`)) {
            if(urlParams.size === 1) {
                newHref = newHref.replace(`?max=${maxPrice}`, '');
            } else {
                newHref = newHref.replace(`&max=${maxPrice}`, '');
            }
        }

        if(newHref.includes(`min=${minPrice}`)) {
            const params = new URLSearchParams(newHref)
            if(params.size === 1) {
                newHref = newHref.replace(`?min=${minPrice}`, '');
            } else {
                newHref = newHref.replace(`&min=${minPrice}`, '');
            }
        }

        window.location.href = newHref;
    } else {
        rangeValue = e.value;
    }
}

const handleUnSelectSize = (e) => {
    if(e.value === size) {
        let ele = document.getElementsByName("size");
        for(let i=0;i<ele.length;i++) {
            ele[i].checked = false;
        }

        if(window.location.href.includes(`size=${size}`)) {
            if(urlParams.size === 1) {
                window.location.href = window.location.href.replace(`?size=${e.value}`, '');
            } else {
                window.location.href = window.location.href.replace(`&size=${e.value}`, '');
            }
        }
    }
}

const handleChangeSize = (e) => {
    if(window.location.href.includes(`size=${size}`)) {
        window.location.href = window.location.href.replace(`size=${size}`, `size=${e.value}`);
    } else {
        if(urlParams.size === 0) {
            window.location.href = `?size=${e.value}`;
        } else {
            window.location.href = `${window.location.href}&size=${e.value}`;
        }
    }
}

const handlePaginate = (newPage) => {
    if(urlParams.size === 0) {
        window.location.href = `?page=${newPage}`;
    } else if(window.location.href.includes(`page=${page}`)) {
        window.location.href = window.location.href.replace(`page=${page}` , `page=${newPage}`);
    } else {
        window.location.href = `${window.location.href}&page=${newPage}`;
    }
}