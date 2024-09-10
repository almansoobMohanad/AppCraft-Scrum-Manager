import React, { useRef } from "react";
import {firestore} from '../firebase/firebaseConfig';
import {addDoc, collection} from '@firebase/firestore';

export default function AccountPage() {
    console.log("Account Page");

    return (
        <h1>Account Page</h1>
    );
}