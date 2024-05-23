import { useEffect } from 'react'

export function Preview() {
    useEffect(() => {
        //

        let baseURL = `http://localhost:3001`
        if (process.env.NODE_ENV === 'production') {
            baseURL = `https://agape-css-diamond-sdk.vercel.app`
        }

        let sdkPath = `${baseURL}/sdk-build/vanilla.module.js?r=${Math.random()}`

        let tt = setTimeout(() => {
            // for vanilla js please use the following snippet to load
            /*
            <script type='module'>
              import(sdkPath).then((r) =>{
                // .....
              })
            </script>
            */

            window.remoteImport(sdkPath).then((agape) => {
                let sdk = new agape.AgapeEngineSDKForCSS({
                    publicAccessToken: `emphasis-2023-11`,
                    domElement: document.querySelector('#myroot'),
                })

                sdk.loadRing({
                    seriesID: `94010R`,
                    fingerSize: 15,
                    diamondSize: 0.35,
                })

                sdk.setColorProfile({
                    type: 'rosegold',
                })

                setTimeout(() => {
                    sdk.setColorProfile({
                        type: 'gold',
                    })
                }, 2000)

                setTimeout(() => {
                    sdk.setColorProfile({
                        type: 'platinum',
                    })
                }, 3000)
            })
        }, 1000 * 4 * 0)

        //
        //

        return () => {
            clearTimeout(tt)
        }
    }, [])

    return (
        <>
            <div id='myroot'></div>
        </>
    )
}
