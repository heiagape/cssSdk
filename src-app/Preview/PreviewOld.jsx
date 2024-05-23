import { useEffect, useState } from 'react'
import { AgapeSDKLoader } from '../AgapeSDKLoader/AgapeSDKLoader'
import { Canvas } from '@react-three/fiber'
import { Gltf, OrbitControls } from '@react-three/drei'
import { useData } from './useData'

const AccessPointBaseURL =
    process.env.NODE_ENV === 'development' ? `http://localhost:3000` : `https://diamond-sdk.vercel.app`
//
// const AccessPointBaseURL = `https://diamond-sdk.vercel.app`

export function Preview() {
    let [sdk, onSDKReady] = useState(null)

    let loadRingSeries = ({ seriesID = 'demo-ring' }) => {
        fetch(`/api/requestRingURL`, {
            method: 'POST',
            body: JSON.stringify({
                baseURL: AccessPointBaseURL,
                action: 'get-series',
                seriesID: seriesID, // 'demo-ring',
            }),
        })
            //
            .then((r) => r.ok && r.json())
            .then((r) => {
                console.log(r)

                // //
                if (r?.seriesID) {
                    let seriesSet = useData.getState().seriesSet
                    let has = seriesSet.some((r) => r.seriesID === r.seriesID)
                    if (!has) {
                        seriesSet.push(r)

                        useData.setState({ seriesSet: [...seriesSet] })

                        useData.setState({ activeSeriesID: r?.seriesID })

                        sdk.agapeEngine.setState({ ringURL: r?.assets[r?.assets?.length - 1]?.url })
                        sdk.agapeEngine.getState().preloadAssets(r.assets)
                    }
                    //
                    // sdk.agapeEngine.setState({
                    //     ringURL: r.ringURL,
                    // })
                    //
                } else {
                    console.error('failed to get ringURL')
                }
            })
    }

    let seriesSet = useData((r) => r.seriesSet)
    let activeSeriesID = useData((r) => r.activeSeriesID)
    let ringURL = useData((r) => r.ringURL)

    useEffect(() => {
        if (sdk) {
            loadRingSeries({ seriesID: '94010RGLB' })
        }
    }, [sdk])
    return (
        <>
            <AgapeSDKLoader onSDKReady={onSDKReady} baseURL={AccessPointBaseURL}></AgapeSDKLoader>

            <div className='text-xs text-right flex  justify-end'>
                <button
                    className='p-2 m-1 bg-gray-200'
                    onClick={() => {
                        //
                        loadRingSeries({ seriesID: '94010RGLB' })
                        //
                    }}
                >
                    Download Series 94010RGLB
                </button>
            </div>

            <div className='text-xs text-right'>
                <div className='p-2 m-1 bg-green-200 inline-block'>{activeSeriesID}</div>
                <div className='flex justify-end'>
                    <div className='p-2 m-1 bg-blue-200 inline-flex items-center'>Choose Diamond Size:</div>
                    <div className=''>
                        {seriesSet
                            ?.find((r) => r.seriesID === activeSeriesID)
                            ?.assets?.map((ring) => {
                                return (
                                    <button
                                        key={ring.id}
                                        onClick={() => {
                                            sdk.agapeEngine.setState({
                                                ringURL: ring.url,
                                            })
                                        }}
                                        className='text-xs bg-gray-200 p-2 m-2'
                                    >
                                        {ring.displayName}
                                    </button>
                                )
                            })}
                    </div>
                </div>

                {activeSeriesID && (
                    <div>
                        <button
                            onClick={() => {
                                sdk.agapeEngine.getState().setColorProfile({ type: 'rosegold' })
                            }}
                            className='text-xs bg-gray-300 p-2 m-2'
                        >
                            Rose gold
                        </button>
                        <button
                            onClick={() => {
                                sdk.agapeEngine.getState().setColorProfile({ type: 'platinum' })
                            }}
                            className='text-xs bg-gray-300 p-2 m-2'
                        >
                            Platinum
                        </button>
                        <button
                            onClick={() => {
                                sdk.agapeEngine.getState().setColorProfile({ type: 'gold' })
                            }}
                            className='text-xs bg-gray-300 p-2 m-2'
                        >
                            Yellow Gold
                        </button>
                    </div>
                )}
            </div>

            {sdk && (
                <div className='w-full h-full flex relative'>
                    <div className='h-full' style={{ width: 'calc(100%)' }}>
                        <Canvas>
                            {/*  */}
                            {/* preload */}
                            <group visible={false}>
                                {seriesSet
                                    ?.find((r) => r.seriesID === activeSeriesID)
                                    ?.assets?.map((ring) => {
                                        return <Gltf key={ring.id} src={ring.url}></Gltf>
                                    })}
                            </group>

                            <sdk.CanvasEntryPoint></sdk.CanvasEntryPoint>

                            <OrbitControls
                                maxPolarAngle={Math.PI * 0.5}
                                minPolarAngle={Math.PI * 0.0}
                                makeDefault
                                object-position={[0, 60, 80]}
                                target={[0, 10, 0]}
                                maxDistance={80 / 2}
                                minDistance={50 / 2}
                                enablePan={false}
                            ></OrbitControls>
                        </Canvas>
                    </div>
                </div>
            )}
        </>
    )
}
