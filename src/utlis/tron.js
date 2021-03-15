import {Toast, Dialog} from 'vant'
import i18n from "../language"

const Env = require('@/env.js');

// const Env = {
//     host: '/app',
//     baseUrl: '',
//     nftContractAddress: 'TUz3p4BsgBZzWTuJzKEPvPHZsh7xYYhQzm',          // 神卡合约地址 测试
//     walletContractAddress: 'TPk7P9F2YmnXkWtSzJGvGNgH177sFKxYo5',          // 钱包合约地址 测试
//     mpsContractAddress: "TLDFfesiD4aqSC9MSHqAiFQt4ZKJTZjotU",             // MPS合约地址 测试
//     decimal: 6,
// };

let nftContractInstance;
let mpsContractInstance;

function alt(msg = {}, callback = () => {
}) {
    Dialog.alert({
        ...msg
    }).then(() => {
        callback();
    });
}

window.onload = () => {
    window.tronWeb.contract().at(Env.nftContractAddress).then(res => {
        nftContractInstance = res;
    }).catch(e => {
        // 找不到該合約
        alt({message: i18n.t('noContract')});
    })
    window.tronWeb.contract().at(Env.mpsContractAddress).then(res => {
        mpsContractInstance = res;
    }).catch(e => {
        // 找不到該合約
        alt({message: i18n.t('noContract')});
    })
};

export function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

export function isAddress(address) {
    if (!address) {
        // 地址不能为空
        Toast(i18n.t('noAddressP'));
        return false;
    }
    return window.tronWeb.isAddress(address);
}

//获取到精度后值 value *( 10 ** decimal )
function getPowValue(value) {
    return Math.pow(10, Env.decimal) * value + '';
}

function toDecimal(value) {
    return value / Math.pow(10, Env.decimal);
}

//充值TRX
export function depositTRX(amount) {
    amount = getPowValue(amount);
    return window.tronWeb.trx.sendTransaction(Env.walletContractAddress, amount)
        .then(res => {
            return Promise.resolve(res);
        }).catch(err => {
            alt({message: i18n.t('rechargeFail')});
            return Promise.reject();
        });
}

//充值MPS
export function depositMPS(amount) {
    amount = getPowValue(amount);
    return mpsContractInstance.transfer(Env.walletContractAddress, amount)
        .send({feeLimit: 10000000})
        .then(res => {
            return Promise.resolve(res);
        }).catch(err => {
            alt({message: i18n.t('rechargeFail')});
            return Promise.reject();
        })
}


//查询用户MPS余额
export function getAccountMPSBalance(account) {
    return mpsContractInstance.balanceOf(account).call().then(res => {
        return Promise.resolve(toDecimal(res));
    }).catch(err => {
        // alt({message: '獲取賬戶餘額失敗'});
        alt({message: i18n.t('errAccount')});
        return Promise.reject();
    })
}

//查询用户TRX余额
export function getAccountTRXBalance() {
    let account = window.tronWeb.defaultAddress.base58;
    return window.tronWeb.trx.getBalance(account).then(res => {
        return Promise.resolve(toDecimal(res));
    }).catch(err => {
        alt({message: i18n.t('errAccount')});
        return Promise.reject();
    });
}

//更新神卡所有者信息
export function updateNFTOwnerDetail(tokenId, nickName, portrait, motto, dressColor, hairColor, weaponryColor, backgroundColor) {
    dressColor = toHex(dressColor);
    hairColor = toHex(hairColor);
    weaponryColor = toHex(weaponryColor);
    backgroundColor = toHex(backgroundColor);
    return nftContractInstance.updateNFTOwnerDetail(tokenId, nickName, portrait, motto, dressColor, hairColor, weaponryColor, backgroundColor).send({feeLimit: 100000000}).then(res => {
        return Promise.resolve(res);
    }).catch(err => {
        alt({message: i18n.t('errUpdateNFTOwnerDetail')});
        return Promise.reject();
    });
}

//转让神卡
export function transferNFT(to, tokenId) {
    if (!isAddress(to)) {
        alt({message: '请输入正确的地址'});
        return Promise.reject();
    }
    return nftContractInstance.transfer(to, tokenId).send({feeLimit: 100000000}).then(res => {
        return Promise.resolve(res);
    }).catch(err => {
        alt({message: i18n.t('errTransferNFT')});
        return Promise.reject();
    });
}

//重新启动神卡挖矿
export function restart(tokenId) {
    return nftContractInstance.restart(tokenId).send({feeLimit: 100000000}).then(res => {
        return Promise.resolve(res);
    }).catch(err => {
        alt({message: i18n.t('errTransferNFT')});
        return Promise.reject();
    });
}

//查询神卡有效时间值 截至日期
export function validityEndTimestamp(tokenId) {
    return mpsContractInstance.validityEndTimestamp(tokenId).call().then(res => {
        return Promise.resolve(window.tronWeb.toDecimal(res));
    }).catch(err => {
        alt({message: i18n.t('errValidityEndTimestamp')});
        return Promise.reject();
    });
}

//查看神卡信息
export function getNFTDetail(tokenId) {
    return nftContractInstance.nftDetails(tokenId).call().then(res => {
        return Promise.resolve(res);
    }).catch(err => {
        return Promise.reject();
    });
}

//查看神卡URI
export function getNFTURI(tokenId) {
    return nftContractInstance.tokenURI(tokenId).call().then(res => {
        return Promise.resolve(res);
    }).catch(err => {
        return Promise.reject();
    });
}

//查看神卡所有者
export function getNFTOwner(tokenId) {
    return nftContractInstance.ownerOf(tokenId).call().then(res => {
        return Promise.resolve(res);
    }).catch(err => {
        return Promise.reject();
    });
}


//查看神卡信息
export function getNFTOwnerDetail(tokenId) {
    return nftContractInstance.nftOwnerDetails(tokenId).call().then(res => {

        // Object.keys(res).forEach(item => {
        //     data[item] = toTokenId(res[item]);
        // });
        let data = {"s": 0, "h": 0, "r": 0, "d": 0}; //-50 ~ 50
        res.dressColor = toTokenId(res.dressColor) === 0 ? data : toAscii(res.dressColor);
        res.hairColor = toTokenId(res.hairColor) === 0 ? data : toAscii(res.hairColor);
        res.weaponryColor = toTokenId(res.weaponryColor) === 0 ? data : toAscii(res.weaponryColor);
        res.backgroundColor = toTokenId(res.backgroundColor) === 0 ? data : toAscii(res.backgroundColor);
        return Promise.resolve(res);
    }).catch(err => {
        return Promise.reject();
    });
}

//查询神卡主人拥有的所有神卡
export function getOwnerAllTokenId() {
    let owner = window.tronWeb.defaultAddress.base58;
    return nftContractInstance.getOwnerAlltokenId(owner).call().then(res => {
        return Promise.resolve(res.map(item => toTokenId(item)));
    }).catch(err => {
        return Promise.reject();
    });
}

//hash转tokenId
export function toTokenId(hash) {
    return window.tronWeb.toDecimal(hash);
}

//判断该昵称是否
export function existsNickName(nickName) {
    return nftContractInstance.existsNickName(nickName).call().then(res => {
        return Promise.resolve(res);
    }).catch(err => {
        return Promise.reject();
    });
}

//hex转任意对象
function toAscii(hash) {
    return window.tronWeb.toUtf8(hash);
}

//任意对象转hash值
function toHex(object) {
    return window.tronWeb.toHex(object);
}