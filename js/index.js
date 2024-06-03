function parseLrc() {
  const lines = lrc.split("\n")
  return lines.map((item) => {
    const parts = item.split("]")
    const timeStr = parts[0].slice(1)
    return {
      time: parseTime(timeStr),
      words: parts[1]
    }
  })
}

function parseTime(timeStr) {
  const parts = timeStr.split(":")
  return +parts[0] * 60 + +parts[1]
}

const lrcData = parseLrc()

const doms = {
  audio: document.querySelector("audio"),
  ul: document.querySelector(".container ul"),
  container: document.querySelector(".container")
}

function findIndex() {
  const currentTime = doms.audio.currentTime
  for (let i = 0; i < lrcData.length; i++) {
    const time = lrcData[i].time
    if (currentTime < time) {
      return i - 1
    }
  }
  return lrcData.length - 1
}

function createLrcElements() {
  const frag = document.createDocumentFragment()
  lrcData.forEach((item) => {
    const li = document.createElement("li")
    li.textContent = item.words
    frag.appendChild(li)
  })

  doms.ul.appendChild(frag)
}

createLrcElements()

const containerHeight = doms.container.clientHeight
const liHeight = doms.ul.children[0].clientHeight
const maxOffset = doms.ul.clientHeight - containerHeight

function setOffset() {
  const index = findIndex()
  let offset = liHeight * index + liHeight / 2 - containerHeight / 2
  if (offset < 0) {
    offset = 0
  }
  if (offset > maxOffset) {
    offset = maxOffset
  }

  doms.ul.style.transform = `translateY(-${offset}px)`

  let li = doms.ul.querySelector(".active")
  if (li) {
    li.classList.remove("active")
  }

  li = doms.ul.children[index]
  if (li) {
    li.classList.add("active")
  }
}

doms.audio.addEventListener("timeupdate", setOffset)
