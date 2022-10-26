export default function (key, map) {
    return map[key] || map['default']
}
