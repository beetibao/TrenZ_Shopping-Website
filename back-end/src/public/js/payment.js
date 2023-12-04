// Change information
var modalInfo = document.getElementById("changeInfo");
var changeBtn = document.getElementById("changeBtn");
var closeBtn = document.getElementsByClassName("closeBtn")[0];
const cusName = document.getElementById("customer-name");
const cusPhone = document.getElementById("customer-phone");
const cusAddress = document.getElementById("customer-address");
const paymentInfoForm = document.getElementById("payment-info-form");
const changeTransForm = document.getElementById("changeTrans");
const btnAccept = document.getElementById("btn-acpt");

const transName = document.getElementById("trans-comp-name");
const transDelivery = document.getElementById("trans-expect-delivery");
const transPrice = document.getElementById("trans-price");

const DISCOUNT = 25000;

let transportComp = {
  id: "ghn",
  name: "Giao hàng nhanh",
  expectDelivery: "(Dự kiến 3-5 ngày)",
  price: 50100,
};

if (transName) {
  transName.innerText = transportComp.name;
}
if (transDelivery) {
  transDelivery.innerText = transportComp.expectDelivery;
}
if (transPrice) {
  transPrice.innerText = `${transportComp.price} đ`;
}

let userInfo = {
  fullName: null,
  phone: null,
  address: null,
};

if (changeBtn) {
  changeBtn.onclick = function () {
    modalInfo.style.display = "block";
  };
}

if (closeBtn) {
  closeBtn.onclick = function () {
    modalInfo.style.display = "none";
  };
}

if (paymentInfoForm) {
  paymentInfoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const fullName = document.getElementById("fullName").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("email").value;

    userInfo = {
      fullName,
      phone,
      address,
      email,
    };

    cusName.innerText = fullName;
    cusPhone.innerText = phone;
    cusAddress.innerText = address;
    modalInfo.style.display = "none";
  });
}

if (changeTransForm) {
  changeTransForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const ghn = document.getElementById("GHN");
    const ghtk = document.getElementById("GHTK");

    if (ghn.checked) {
      transportComp = {
        id: "ghn",
        name: "Giao hàng nhanh",
        expectDelivery: "(Dự kiến 3-5 ngày)",
        price: 50100,
      };
    }

    if (ghtk.checked) {
      transportComp = {
        id: "ghtk",
        name: "Giao hàng tiết kiệm",
        expectDelivery: "(Dự kiến 2-3 ngày)",
        price: 60000,
      };
    }

    if (transName) {
      transName.innerText = transportComp.name;
    }
    if (transDelivery) {
      transDelivery.innerText = transportComp.expectDelivery;
    }
    if (transPrice) {
      transPrice.innerText = `${transportComp.price} đ`;
    }

    if (transFeeEl) {
      transFeeEl.innerText = `${transportComp.price}đ`;
    }

    const discountEl = document.getElementById("discount");
    if (discountEl) {
      discountEl.innerText = `-${DISCOUNT}đ`;
    }
    const sumOfProductsEl = document.getElementById("sum-of-prod");
    const finalTotalEl = document.getElementById("sum");
    const sumOfProducts = parseInt(sumOfProductsEl.innerText.split("đ")[0]);
    if (!isNaN(sumOfProducts)) {
      const finalTotal = sumOfProducts + transportComp.price - DISCOUNT;

      finalTotalEl.innerText = `${finalTotal} đ`;
    }

    transInfo.style.display = "none";
  });
}

window.onclick = function (event) {
  if (event.target == modalInfo) {
    modalInfo.style.display = "none";
  }
};
// Change transport company
var transInfo = document.getElementById("changeTrans");
var changeTransBtn = document.getElementById("changeTransBtn");
var closeTransBtn = document.getElementsByClassName("closeTransBtn")[0];
if (changeTransBtn) {
  changeTransBtn.onclick = function () {
    transInfo.style.display = "block";
  };
}

if (closeTransBtn) {
  closeTransBtn.onclick = function () {
    transInfo.style.display = "none";
  };
}
window.onclick = function (event) {
  if (event.target == transInfo) {
    transInfo.style.display = "none";
  }
};

// Confirm Order
var confirmOrder = document.getElementById("confirmPlaceOrder");
var cancelOrderBtn = document.getElementsByClassName("cancelOrder")[0];
const orderConfirmedForm = document.getElementById("orderConfirmed");
const closeOrderConfirmedBtn = document.getElementById(
  "closeOrderConfirmedBtn"
);

if (closeOrderConfirmedBtn) {
  closeOrderConfirmedBtn.addEventListener((e) => {
    e.preventDefault();
    orderConfirmedForm.style.display = "none";

    window.location.href = location.hostname;
  });
}
let selectedMethod = null;

const acceptOrder = () => {
  confirmOrder.style.display = "block";
};

if (cancelOrderBtn) {
  cancelOrderBtn.addEventListener("click", (e) => {
    e.preventDefault();
    confirmOrder.style.display = "none";
  });
}

if (confirmOrder) {
  confirmOrder.addEventListener("submit", (e) => {
    e.preventDefault();

    const cod = document.getElementById("COD");
    const creditCard = document.getElementById("Credit-card");
    const momo = document.getElementById("MoMo-EWallet");

    if (cod.checked) {
      selectedMethod = "Thanh toán khi nhận hàng (COD)";
    }
    if (creditCard.checked) {
      selectedMethod = "Thanh toán qua thẻ ngân hàng";
    }
    if (momo.checked) {
      selectedMethod = "Thanh toán qua ví MoMo";
    }

    if (!cod.checked && !creditCard.checked && !momo.checked) {
      return;
    }

    const missingValue = Object.keys(userInfo).find((el) => !userInfo[el]);
    if (missingValue) {
      return;
    }

    const sumOfProductsEl = document.getElementById("sum-of-prod");
    const sumOfProducts = parseInt(sumOfProductsEl.innerText.split("đ")[0]);

    fetch("http://localhost:3000/payment/addPayment", {
      method: "POST",
      body: JSON.stringify({
        user_id: 1,
        name: userInfo.fullName,
        address: userInfo.address,
        total: sumOfProducts - transportComp.price - DISCOUNT,
        phone: userInfo.phone,
        detail: transportComp.name,
        payment_method: selectedMethod,
        status: "Đơn hàng đã đặt",
        created_at: new Date(),
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((response) => {
      if (response.status === 200) {
        confirmOrder.style.display = "none";
        orderConfirmedForm.style.display = "block";
      }
    });
  });
}

// Order
const discountEl = document.getElementById("discount");
if (discountEl) {
  discountEl.innerText = `-${DISCOUNT}đ`;
}

const transFeeEl = document.getElementById("tranp-fee");
if (transFeeEl) {
  transFeeEl.innerText = `${transportComp.price}đ`;
}
const sumOfProductsEl = document.getElementById("sum-of-prod");
const finalTotalEl = document.getElementById("sum");
if (sumOfProductsEl) {
  const sumOfProducts = parseInt(sumOfProductsEl.innerText.split("đ")[0]);
  if (!isNaN(sumOfProducts)) {
    const finalTotal = sumOfProducts - transportComp.price - DISCOUNT;

    finalTotalEl.innerText = `${finalTotal} đ`;
  }
}
