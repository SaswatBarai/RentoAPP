import { selector } from "recoil";
import {authStatusAtom} from "../atoms/authAtoms.js"


export const isAuthenticatedSelector = selector({
    key:"isAuthenticatedSelector",
    get:({get}) => get(authStatusAtom)
})
