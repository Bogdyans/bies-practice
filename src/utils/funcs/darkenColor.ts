export default function darkenColor(color: string, percent: number): string {
    color = color.replace("#", "")

    let r = Number.parseInt(color.substring(0, 2), 16)
    let g = Number.parseInt(color.substring(2, 4), 16)
    let b = Number.parseInt(color.substring(4, 6), 16)

    r = Math.floor((r * (100 - percent)) / 100)
    g = Math.floor((g * (100 - percent)) / 100)
    b = Math.floor((b * (100 - percent)) / 100)

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
}