export default async function handler(req, res) {
    const { date } = req.query
    
    if (!date) {
        return res.status(400).json({ error: 'Date parameter required' })
    }
    
    const [year, month, day] = date.split('-')
    const url = `https://melroseschools.api.nutrislice.com/menu/api/weeks/school/melrose/menu-type/breakfast/${year}/${month}/${day}/`
    
    try {
        const response = await fetch(url)
        const data = await response.json()
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch menu' })
    }
}