import * as React from 'react'

export default function IframeWrapper(src: string) {

    return () => <iframe className="content-iframe" src={src}/>

}
