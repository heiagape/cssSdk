// import { SessionProvider } from "next-auth/react";
import { useEffect, useRef, useState } from 'react'
import '../src-app/css/global.css'
import Head from 'next/head'
export default function Page({ Component, pageProps: { session, ...pageProps } }) {
    useEffect(() => {
        // setOK(true)
    }, [])
    return (
        <>
            <Head>
                <title>CSS x Reunite</title>
            </Head>
            {/* <SessionProvider session={session}> */}
            {
                <PasswordProtect>
                    <Component {...pageProps}></Component>
                </PasswordProtect>
            }
            {/* </SessionProvider> */}
        </>
    )
}

function PasswordProtect({ children }) {
    let ref = useRef()
    let [ok, setOK] = useState('loading')

    useEffect(() => {
        if (localStorage.getItem('ok') === 'ok') {
            setOK(true)
        } else {
            setOK(false)
        }
    }, [])
    if (ok === 'loading') {
        return <></>
    }
    return ok === true ? (
        children
    ) : (
        <form
            onSubmit={(ev) => {
                ev.stopPropagation()
                ev.preventDefault()

                let pw = ref.current.value
                let url = `/api/guipw`

                fetch(`${url}`, {
                    mode: 'cors',
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({ pw: pw }),
                })
                    .then((r) => r.json())
                    .then((r) => {
                        console.log(r)

                        if (r.ok === true) {
                            localStorage.setItem('ok', 'ok')
                            setOK(true)
                        } else {
                            alert('Wrong password')
                            setOK(false)
                        }
                    })
                    .catch((r) => {
                        console.log(r)
                    })
            }}
            //
            className='w-full h-full flex flex-col items-center justify-center'
        >
            <div className='flex flex-col items-center justify-center'>
                <input
                    className='bg-gray-200 p-3 hidden'
                    placeholder='usermame'
                    value={'nouser'}
                    onChange={() => {}}
                    type='text'
                ></input>
                <input
                    className='bg-gray-200 p-3'
                    ref={ref}
                    placeholder='Password'
                    onChange={() => {}}
                    type='password'
                ></input>
            </div>
            <div>
                <button
                    type='submit'
                    className='bg-gray-200 m-3 p-2  rounded-lg'
                    onClick={() => {
                        // console.log(ref.current.value)
                    }}
                >
                    Enter
                </button>
            </div>
        </form>
    )
}
