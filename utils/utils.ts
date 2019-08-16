import { isNullOrUndefined } from "util";

export const isOnlyNumber = (number: any) => {
    //const re = /^[0-9]+$/;
    //return re.test(number);
    return isNaN(parseInt(number)) === false;
}

export const isEmpty = (str: string) => {
    if( isNullOrUndefined(str) || str.length === 0 ){
        return true;
    }
    return false;
}

export const trimEmoji = (str: string): string => {
    return str.replace(/[\ud800-\udfff]/g, '');
}

export const markRandomStr = (length: number) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
