export default async function handler(req, res) {
    // Already need to have checked date and firebase before calling
    const url = "https://aspenbridge.onrender.com/schedule"
    
    try {
        const response = await fetch(url, {
            headers: {
                'X-API-Key': process.env.SCHEDULE_KEY
            }
        })
        const data = await response.json()
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch aspen' })
    }
}