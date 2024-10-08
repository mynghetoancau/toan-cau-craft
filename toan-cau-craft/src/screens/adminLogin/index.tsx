"use client"
import { checkAdminRole } from '@/models/Users'
import { auth } from '@/utils/FireBase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'react-toastify'
import googleButton from '../../../public/images/sign-in.png'

const AdminLogin = () => {
    const router = useRouter()
    function googleLogin() {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(async (result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                // The signed-in user info.
                const user = result.user;

                const isAdmin = await checkAdminRole();
                if (isAdmin) {
                    localStorage.setItem('user', JSON.stringify({
                        email: user.email,
                        role: "admin"
                    }))
                    router.push('/admin');
                } else {
                    localStorage.removeItem('user');
                    toast.error("Bạn không có quyền truy cập!");
                }

            }).catch((error) => {
                
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.log('errorCode', errorCode);
            });
    }
    return (
        <div className="w-full bg-themeWhite h-[75vh] flex justify-center items-center">
            <button className='w-1/5' onClick={googleLogin}>
                <Image src={googleButton} alt='Sign in google button' />
            </button>
        </div>
    )
}

export default AdminLogin