import { useEffect } from 'react'
import * as React from 'react'
// const
import tunnel from 'tunnel-rat'

const t = tunnel()

export function AgapeHTML({}) {
    return (
        <>
            <t.Out></t.Out>
        </>
    )
}

export function AgapeSDKLoader({ baseURL, sdkPath = `sdk-build`, appID, onSDKReady = () => {}, props = {} }) {
    useEffect(() => {
        window['React'] = React

        window.Globals = window.Globals || {}

        let loadGlobals = async ({ globals: array }) => {
            let res = array
                .filter((r) => {
                    return r.needs
                })
                .map(async (r) => {
                    let name = r.name

                    if (!window.Globals[name] && name === 'react') {
                        window.Globals['react'] = await import('react')
                    }
                    if (!window.Globals[name] && name === 'three') {
                        window.Globals['three'] = await import('three')
                    }
                    if (!window.Globals[name] && name === 'zustand') {
                        window.Globals['zustand'] = await import('zustand')
                    }
                    if (!window.Globals[name] && name === '@react-three/fiber') {
                        window.Globals['@react-three/fiber'] = await import('@react-three/fiber')
                    }
                    if (!window.Globals[name] && name === '@react-three/drei') {
                        window.Globals['@react-three/drei'] = await import('@react-three/drei')
                    }
                    // if (!window.Globals[name] && name === '@react-three/postprocessing') {
                    //     window.Globals['@react-three/postprocessing'] = await import('@react-three/postprocessing')
                    // }
                    // if (!window.Globals[name] && name === '@react-three/xr') {
                    //     window.Globals['@react-three/xr'] = await import('@react-three/xr')
                    // }
                    // if (!window.Globals[name] && name === 'three-stdlib') {
                    //     window.Globals['three-stdlib'] = await import('three-stdlib')
                    // }
                    //
                    //
                })
                .map((r) => {
                    r.catch((err) => {
                        console.log(err)
                    })
                    return r
                })

            await Promise.all(res)
        }

        let socket = false

        let run = async ({ loaderUtils, socket }) => {
            let loadCode = (i = 0) => {
                loaderUtils
                    .load(`${baseURL}/${sdkPath}/main.module.js?hash=${encodeURIComponent('_' + Math.random())}`)

                    .then(
                        (r) => {
                            //

                            //
                            if (r && typeof r.CanvasEntryPoint === 'function') {
                                console.log('Refreshing...')

                                if (r.useSwan && typeof r.useSwan === 'function') {
                                    r.useSwan.setState({
                                        baseURL,
                                    })
                                }

                                onSDKReady(r)
                            } else {
                                if (i < 10) {
                                    console.log('Retrying...' + i)

                                    setTimeout(() => {
                                        i = i + 1
                                        loadCode(i)
                                    }, 1000)
                                }
                            }
                        },
                        (err) => {
                            console.log(err)
                        },
                    )
            }

            loadCode()
        }

        getLoader().then(async (loaderUtils) => {
            socket = false

            await loaderUtils
                .load(`${baseURL}/${sdkPath}/preload.module.js?hash=${encodeURIComponent('_' + Math.random())}}`)
                .then((mod) => {
                    return mod.preload({ loadGlobals })
                })
                .catch((err) => {
                    console.log(err)
                })

            return run({ loaderUtils, socket })
        })

        return () => {}
    }, [baseURL, sdkPath, appID])
    return <></>
}

export const DefaultSetting = {
    onFetch: ({ url, options }) => {
        return fetch(url, {
            ...options,
            mode: 'cors',
        })
    },
    onResolve: ({ id, parentUrl, resolve }) => {
        // console.log(id, parentUrl);

        if (parentUrl.indexOf('blob:') === 0) {
            return resolve(id, '')
        }

        return resolve(id, parentUrl)
    },
}

export const getLoader = async ({ onResolve = () => {}, onFetch = () => {} } = DefaultSetting) => {
    let res = document.body.querySelector('#importmap')

    if (!res) {
        document.body.appendChild(
            Object.assign(document.createElement('script'), {
                id: 'importmap',
                type: 'importmap-shim',
                innerHTML: JSON.stringify({
                    imports: {},
                }),
            }),
        )

        // document.body.appendChild(
        //   Object.assign(document.createElement('script'), {
        //     id: 'esms-options',
        //     innerHTML: JSON.stringify({
        //       shimMode: true,
        //     }),
        //   })
        // )
    }

    return new Promise(async (resolve) => {
        window.esmsInitOptions = {
            // Enable Shim Mode
            shimMode: true, // default false
            // Enable newer modules features
            polyfillEnable: ['css-modules', 'json-modules'], // default empty
            // Custom CSP nonce
            nonce: 'n0nce', // default is automatic detection
            // Don't retrigger load events on module scripts
            noLoadEventRetriggers: true, // default false
            // Skip source analysis of certain URLs for full native passthrough
            // skip: /^https:\/\/cdn\.com/, // defaults to null
            // Clean up blob URLs after execution
            revokeBlobURLs: true, // default false
            // Secure mode to not support loading modules without integrity (integrity is always verified though)
            enforceIntegrity: false, // default false
            // Permit overrides to import maps
            mapOverrides: true, // default false

            // -- Hooks --
            // Module load error
            onerror: (e) => {
                /*...*/
            }, // default noop
            // Called when polyfill mode first engages
            onpolyfill: () => {}, // default logs to the console
            // Hook all module resolutions
            resolve: (id, parentUrl, resolve) => {
                return onResolve({ id, parentUrl, resolve })
                // return resolve(id, parentUrl)
            }, // default is spec resolution
            // Hook source fetch function
            fetch: (url, options) => {
                //fetch(url, options)
                return onFetch({ url, options })
            }, // default is native
            // Hook import.meta construction
            meta: (meta, url) => {}, // default is noop
            // Hook top-level imports
            onimport: (url, options, parentUrl) => {
                // console.log('onimport', url, options, parentUrl)
            }, // default is noop
        }

        await import('es-module-shims')

        let tt = setInterval(() => {
            if (window.importShim) {
                clearInterval(tt)
                resolve({
                    load: window.importShim,
                    addImportMap: window.importShim.addImportMap,
                })
            }
        })
    })
}

//
