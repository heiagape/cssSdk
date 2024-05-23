export default async function (req, res) {
    let bodyJSON = {}

    try {
        bodyJSON = JSON.parse(req.body)
    } catch (e) {
        console.log(e)
    }

    if (bodyJSON.pw === 'cssagape') {
        return res.status(200).json({ ok: true })
    }

    return res.status(406).json({ error: 'wrong pw' })
}
