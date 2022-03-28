const express = require('express'),
    router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');


const Iyzipay = require('iyzipay');

//Initialize Iyzipay
const iyzipay = new Iyzipay({
    apiKey: 'sandbox-LU6XrhSdXzKHIo6QDJTSm5OYkzcdhKrI',
    secretKey: 'sandbox-wGR4T5wwAN3qkdFvQbcyvc15TtdR2Pb6',
    uri: 'https://sandbox-api.iyzipay.com'
});

const BasketItems = [
    {
        id: 'BI101',
        name: 'Binocular',
        category1: 'Collectibles',
        category2: 'Accessories',
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: '0.3'
    },
    {
        id: 'BI102',
        name: 'Game code',
        category1: 'Game',
        category2: 'Online Game Items',
        itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
        price: '0.5'
    },
    {
        id: 'BI103',
        name: 'Usb',
        category1: 'Electronics',
        category2: 'Usb / Cable',
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: '0.2'
    },
]

let totalPrice = 0;
BasketItems.forEach(item => {
    totalPrice += parseFloat(item.price)
});




router.get('/payment',(req,res)=>{
    res.render('adress',{
        BasketItems,
        totalPrice
    });
})

router.post('/payment/checkout',(req,res)=>{

    const request = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: '123456789',
        price: totalPrice,
        paidPrice: totalPrice,
        currency: Iyzipay.CURRENCY.TRY,
        basketId: 'B67832',
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        callbackUrl: 'http://localhost:3000/payment/result',
        enabledInstallments: [2, 3, 6, 9],
        buyer: {
            id: 'BY789',
            name: req.body.firstName,
            surname: req.body.lastName,
            gsmNumber: '+905350000000',
            email: req.body.email,
            identityNumber: '74300864791',
            lastLoginDate: '2015-10-05 12:43:35',
            registrationDate: '2013-04-21 15:12:09',
            registrationAddress: req.body.address + req.body.address2,
            ip: '85.34.78.112',
            city: 'Istanbul',
            country: 'Turkey',
            zipCode: '34732'
        },
        shippingAddress: {
            contactName: req.body.firstName + req.body.lastName,
            city: 'Istanbul',
            country: 'Turkey',
            address: req.body.address + req.body.address2,
            zipCode: '34742'
        },
        billingAddress: {
            contactName: req.body.firstName + req.body.lastName,
            city: 'Istanbul',
            country: 'Turkey',
            address: req.body.address + req.body.address2,
            zipCode: '34742'
        },
        basketItems: BasketItems
    };

    iyzipay.checkoutFormInitialize.create(request,function (err,result){
        res.render('checkout',{form : result.checkoutFormContent})
        //console.log(result)
    })
})

router.post('/result',(req,res)=>{

    iyzipay.checkoutForm.retrieve({
        locale: Iyzipay.LOCALE.TR,
        conversationId: '123456789',
        token: req.body.token
    }, function (err, result) {
        const message = result.paymentStatus === 'SUCCESS' ? "Tebrikler Ödeme Başarılı" : "Hay Aksi! Bir şeyler ters gitti"
        res.render('result',{ message });
        //console.log(result)
    });
})
module.exports = router;
