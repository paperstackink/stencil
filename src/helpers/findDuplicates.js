export default function (array) {
  return array.filter((item, index) => array.indexOf(item) != index)
}
