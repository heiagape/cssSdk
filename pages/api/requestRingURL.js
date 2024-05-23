export default async function (req, res) {
    let bodyJSON = {}

    try {
        bodyJSON = JSON.parse(req.body)
    } catch (e) {
        console.log(e)
    }

    return (
        fetch(`${bodyJSON.baseURL}/api/replyRingURL`, {
            method: 'POST',
            body: JSON.stringify({
                key: process.env.AGAPE_KEY,
                secret: process.env.AGAPE_SECRET,
                ...bodyJSON,
            }),
        })
            //
            .then((r) => r.ok && r.json())
            .then((data) => {
                res.status(200).json(data)
            })
            .catch((e) => {
                console.log(e)
                res.status(500).json({ error: 'server error' })
            })
    )
}
