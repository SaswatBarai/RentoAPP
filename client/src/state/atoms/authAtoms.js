import {atom} from 'recoil';



export const authStatusAtom = atom({
    key:"authStatusAtom",
    default:false
});


export const userDataAtom = atom({
    key:"userDataAtom",
    default:null
})


export const accesTokenAtom = atom({
    key:"accesTokenAtom",
    default:""
});