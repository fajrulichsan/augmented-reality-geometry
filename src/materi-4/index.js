// Materi 4: "Ayo Mengeksplorasi dengan AR!" - Luas Permukaan Limas (PRD-materi-4.md).
// Everything specific to this materi lives in this folder; it only talks to the outside world
// through initMateri4's arguments and the sceneModule API (see ../threejs-scene-init.js: the
// materi 3 additions plus the "Materi 4 additions" block - setFaceView/setFaceOrderLabels/
// showFaceEdge/showPyramidHeight/model controls).
//
// AR only ever shows raw size data (cm values read from the 3D model, the single source of truth).
// It never shows a formula, a base/lateral/total area, or a verdict - see PRD section 2 / AC-7.
import './materi-4.css'
import {MATERI4_MARKUP} from './markup'
import {ASPECTS} from './aspects'

// Where "Selesai Eksplorasi AR" sends the student (e-module "Tahap 4 - Ayo Mengolah Informasi").
// Left empty until the e-module URL is known; the flow then simply returns to the start screen.
const TAHAP_4_URL = ''

const GEOGEBRA_STEPS = [
  'Bandingkan model AR limas ini dengan jaring-jaring limas di GeoGebra.',
  'Temukan bagian alas dan sisi tegak pada jaring-jaring yang bersesuaian dengan model AR.',
  'Apa hubungan yang kamu temukan?',
]

const PYRAMID_NAMES = {3: 'Limas Segitiga', 4: 'Limas Segiempat', 5: 'Limas Segilima'}
const pyramidName = (n) => PYRAMID_NAMES[n] || `Limas Segi-${n}`

// Session state (PRD section 5), one record per pyramid type so data never mixes between limas.
const newPyramidState = (n) => ({
  pyramidType: n,
  placedModel: null,
  placed: false,
  introDone: false,
  observedAspects: [],
  selectedFaces: [], // [{id, order}]
  baseEdgeMeasurements: {}, // edgeIndex -> cm
  lateralMeasurements: {}, // faceId -> {baseLength?, triangleHeight?}
  findingsRecorded: {}, // aspectId -> true (the text itself lives in the e-module)
  baseSeen: false,
  lateralSeen: false,
  sufficiency: 'belum', // 'belum' | 'cukup' | 'perlu'
})

export const initMateri4 = (sceneModule, {startAr}) => {
  const root = document.getElementById('materi-4-root')
  root.innerHTML = MATERI4_MARKUP

  const $ = (id) => document.getElementById(id)
  const screens = root.querySelectorAll('.screen')
  const bar = $('eksplorasi-bar-m4')
  const showScreen = (id) => {
    screens.forEach((el) => el.classList.add('hidden'))
    bar.classList.add('hidden')
    $(id).classList.remove('hidden')
  }

  const sessions = {}
  let S = null // state of the pyramid on screen
  let arStarted = false
  let queue = []
  let activeAspect = null
  let comparePendingFrom = null
  let tapHandler = null
  let edgeHandler = null
  let hintOn = false
  let hintText = ''

  const lateralCount = () => sceneModule.getFaceCount() - 1 // face 0 = alas, 1..n = sisi tegak
  const lateral = (id) => {
    if (!S.lateralMeasurements[id]) {
      S.lateralMeasurements[id] = {}
    }
    return S.lateralMeasurements[id]
  }
  const hasBothMeasures = (id) => {
    const m = S.lateralMeasurements[id]
    return !!m && m.baseLength !== undefined && m.triangleHeight !== undefined
  }
  const sisiName = (id) => `Sisi Tegak ${id}`

  // --- Eksplorasi bar helpers ---
  const setActions = (actions) => {
    const holder = $('m4-actions')
    holder.innerHTML = ''
    actions.forEach(({label, primary, small, onClick}) => {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.textContent = label
      btn.className = `${primary ? 'btn-primary' : 'btn-secondary'}${small ? ' small' : ''}`
      btn.addEventListener('click', onClick)
      holder.appendChild(btn)
    })
  }

  const setHint = () => {
    const el = $('m4-hint')
    el.textContent = hintOn ? hintText : ''
    el.classList.toggle('hidden', !hintOn)
  }

  const setInfo = (lines) => {
    const el = $('m4-info')
    el.innerHTML = lines.join('<br>')
    el.classList.toggle('hidden', lines.length === 0)
  }

  const render = ({prompt, info = [], actions = []}) => {
    $('m4-prompt').textContent = prompt
    setInfo(info)
    setActions(actions)
    setHint()
  }

  // The hint stays hidden until the student presses this button (PRD principle 3 / AC-3).
  const hintAction = (text) => ({
    label: 'Butuh Petunjuk?',
    small: true,
    onClick: () => {
      hintText = text
      hintOn = !hintOn
      setHint()
    },
  })

  // Clears every temporary mark/selection and stops accepting taps.
  const clearScene = () => {
    tapHandler = null
    edgeHandler = null
    sceneModule.resetMarks()
    sceneModule.setFaceView({})
    sceneModule.setMeasureFace(null)
    sceneModule.showPyramidHeight(false)
  }

  const openBar = () => {
    screens.forEach((el) => el.classList.add('hidden'))
    bar.classList.remove('hidden')
  }

  const view = (styles) => sceneModule.setFaceView(styles)
  const onlyFace = (id) => {
    const styles = {}
    for (let i = 0; i <= lateralCount(); i++) {
      styles[i] = i === id ? 'a' : 'dim'
    }
    return styles
  }

  // --- Screens: awal -> pilih limas -> tempatkan -> eksplorasi awal -> menu aspek ---
  $('btn-mulai-m4').addEventListener('click', () => {
    if (!arStarted) {
      arStarted = true
      startAr()
    }
    showPilihLimas()
  })

  const segiNSlider = $('segi-n-slider-m4')
  $('btn-limas-segin-m4').addEventListener('click', () => {
    $('limas-segin-row-m4').classList.toggle('hidden')
  })
  segiNSlider.addEventListener('input', () => {
    $('segi-n-value-m4').textContent = segiNSlider.value
  })
  $('btn-pilih-segi-n-m4').addEventListener('click', () => chooseLimas(Number(segiNSlider.value)))
  $('limas-grid-m4').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-n]')
    if (btn) {
      chooseLimas(Number(btn.dataset.n))
    }
  })
  $('btn-limas-kembali-m4').addEventListener('click', () => {
    comparePendingFrom = null
    showMenu()
  })

  const showPilihLimas = () => {
    $('limas-segin-row-m4').classList.add('hidden')
    $('btn-limas-kembali-m4').classList.toggle('hidden', !S)
    showScreen('screen-pilih-limas-m4')
  }

  const saveTransform = () => {
    if (S && S.placed) {
      S.placedModel = sceneModule.getModelTransform()
    }
  }

  const chooseLimas = (n) => {
    saveTransform()
    if (!sessions[n]) {
      sessions[n] = newPyramidState(n)
    }
    S = sessions[n]
    sceneModule.setNetMode(false)
    sceneModule.setShape(`limas-${n}`)
    sceneModule.setTransparent(false)
    clearScene()
    if (S.placedModel) {
      sceneModule.setModelTransform(S.placedModel)
    }
    if (S.placed) {
      afterPlacement()
    } else {
      showPlacement()
    }
  }

  let placementTimer = null
  const showPlacement = () => {
    $('tempatkan-prompt-m4').textContent = 'Arahkan kamera ke permukaan datar.'
    showScreen('screen-tempatkan-m4')
    clearTimeout(placementTimer)
    // The 8th Wall SLAM engine has no explicit "surface found" event, so the second prompt simply
    // follows after a moment of scanning.
    placementTimer = setTimeout(() => {
      $('tempatkan-prompt-m4').textContent = 'Ketuk permukaan untuk menempatkan limas.'
    }, 1500)
  }

  $('btn-tempatkan-m4').addEventListener('click', () => {
    clearTimeout(placementTimer)
    try {
      XR8.XrController.recenter()
    } catch (err) {
      // Camera/tracking not ready: the model is still shown at its default spot and Reset works.
    }
    S.placed = true
    afterPlacement()
  })

  const afterPlacement = () => {
    if (comparePendingFrom !== null && comparePendingFrom !== S.pyramidType) {
      $('bandingkan-limas-judul-m4').textContent =
        `${pyramidName(comparePendingFrom)} ↔ ${pyramidName(S.pyramidType)}`
      comparePendingFrom = null
      showScreen('screen-bandingkan-limas-m4')
      return
    }
    comparePendingFrom = null
    continueAfterIntro()
  }

  const continueAfterIntro = () => {
    if (S.introDone) {
      showMenu()
      return
    }
    // 4.4 Eksplorasi awal: a non-blocking bar so the student can rotate the model and tap a bidang
    // to highlight it temporarily (plain toggle highlight, no aspect yet).
    clearScene()
    sceneModule.setAspectTarget('sisi')
    render({
      prompt: 'Putar dan amati limas dari berbagai arah. Bagian apa saja yang kamu lihat pada permukaannya? Ketuk sebuah bidang untuk menandainya sementara.',
      actions: [{label: 'Mulai Menyelidiki', primary: true, onClick: () => {
        S.introDone = true
        showMenu()
      }}],
    })
    openBar()
  }

  $('btn-bandingkan-limas-lanjut-m4').addEventListener('click', continueAfterIntro)

  // --- Menu Aspek ---
  const aspekList = $('aspek-list-m4')
  const btnLanjut = $('btn-aspek-lanjut-m4')

  const geogebraReady = () => S.baseSeen && S.lateralSeen

  const showMenu = () => {
    clearScene()
    aspekList.innerHTML = ASPECTS.map((aspect) => `
      <label>
        <input type="checkbox" value="${aspect.id}">
        <span>${aspect.label}${S.observedAspects.includes(aspect.id) ? ' ✓' : ''}</span>
      </label>
    `).join('')
    btnLanjut.disabled = true
    $('btn-geogebra-menu-m4').classList.toggle('hidden', !geogebraReady())
    showScreen('screen-menu-aspek-m4')
  }

  aspekList.addEventListener('change', () => {
    btnLanjut.disabled = aspekList.querySelectorAll('input:checked').length === 0
  })

  btnLanjut.addEventListener('click', () => {
    // Chosen aspects run one after another; the student can still go back to the menu any time.
    queue = Array.from(aspekList.querySelectorAll('input:checked')).map((el) => el.value)
    startAspect(queue.shift())
  })

  // --- Model controls (PRD 4.3) ---
  $('btn-m4-putar').addEventListener('click', () => sceneModule.rotateModel(Math.PI / 6))
  $('btn-m4-besar').addEventListener('click', () => sceneModule.scaleModel(1.2))
  $('btn-m4-kecil').addEventListener('click', () => sceneModule.scaleModel(1 / 1.2))
  $('btn-m4-reset').addEventListener('click', () => sceneModule.resetModel())
  $('btn-m4-geser').addEventListener('click', (e) => {
    const on = !e.currentTarget.classList.contains('active')
    e.currentTarget.classList.toggle('active', on)
    sceneModule.setDragMode(on ? 'move' : 'rotate')
  })

  sceneModule.onFaceTap((index) => {
    if (tapHandler) {
      tapHandler(index)
    }
  })
  sceneModule.onEdgeMeasureTap((tap) => {
    if (edgeHandler) {
      edgeHandler(tap)
    }
  })

  // --- Aspects ---
  const finish = () => goCatat()

  const catatAction = (label = 'Catat Temuanmu') => ({label, primary: true, onClick: finish})

  const pickLateral = (prompt, onPicked) => {
    view({})
    render({prompt})
    tapHandler = (i) => {
      if (i === 0) {
        render({prompt: 'Itu alas limas. Ketuk salah satu sisi tegak (segitiga yang bertemu di puncak).'})
        return
      }
      S.lateralSeen = true
      onPicked(i)
    }
  }

  // Shows what has already been measured for a sisi tegak (and re-draws the marks on the model).
  const revealLateral = (id) => {
    const m = lateral(id)
    const info = []
    if (m.baseLength !== undefined) {
      sceneModule.showFaceEdge(id, 0)
      info.push(`Panjang alas segitiga = ${m.baseLength} cm`)
    }
    if (m.triangleHeight !== undefined) {
      sceneModule.showHeightLine(id)
      info.push(`Tinggi segitiga pada sisi tegak = ${m.triangleHeight} cm`)
    }
    return info
  }

  // Ukur Alas Segitiga / Ukur Tinggi Segitiga for one sisi tegak, shared by A5 and A7.
  const measureLateral = (id, onBoth, extraActions = []) => {
    view(onlyFace(id))
    const step = () => {
      const m = lateral(id)
      const info = revealLateral(id)
      const both = m.baseLength !== undefined && m.triangleHeight !== undefined
      if (both) {
        onBoth(id, info)
        return
      }
      render({
        prompt: `${sisiName(id)} dipilih. Klik bagian yang ingin kamu ukur.`,
        info,
        actions: [
          {label: 'Ukur Alas Segitiga', onClick: () => {
            lateral(id).baseLength = sceneModule.showFaceEdge(id, 0)
            step()
          }},
          {label: 'Ukur Tinggi Segitiga', onClick: () => {
            lateral(id).triangleHeight = sceneModule.showHeightLine(id)
            step()
          }},
          ...extraActions,
        ],
      })
    }
    step()
  }

  const ASPECT_FLOWS = {
    // A1 Bentuk Alas
    'bentuk-alas': () => {
      render({prompt: 'Identifikasi bagian alas limas. Putar model agar alas terlihat, lalu ketuk alas untuk menandainya.'})
      tapHandler = (i) => {
        if (i !== 0) {
          render({prompt: 'Itu bukan alas. Putar limas dan cari bagian yang menjadi alasnya.'})
          return
        }
        S.baseSeen = true
        view({0: 'a'})
        render({prompt: 'Berbentuk apakah alas limas ini?', actions: [catatAction()]})
      }
    },

    // A2 Bentuk Sisi Tegak
    'bentuk-sisi-tegak': () => {
      const sel = []
      const styles = () => Object.fromEntries(sel.map((id, k) => [id, k === 0 ? 'a' : 'b']))
      const backAction = {label: 'Kembali', onClick: showMenu}
      render({prompt: 'Ketuk salah satu sisi tegak untuk menandainya.', actions: [hintAction('Perhatikan bentuk dan ukuran kedua sisi tegak.')]})
      tapHandler = (i) => {
        if (i === 0) {
          render({prompt: 'Itu alas limas. Ketuk salah satu sisi tegak.'})
          return
        }
        S.lateralSeen = true
        if (!sel.includes(i)) {
          sel.push(i)
        }
        S.selectedFaces = sel.map((id, order) => ({id, order: order + 1}))
        view(styles())
        const actions = [{
          label: 'Amati Sisi Tegak Lain',
          onClick: () => render({prompt: 'Ketuk sisi tegak lain untuk ditandai.', actions: actions0()}),
        }]
        // Bandingkan Sisi Tegak only appears once at least 2 sisi tegak are chosen (AC-2).
        if (sel.length >= 2) {
          actions.push({label: 'Bandingkan Sisi Tegak', primary: true, onClick: () => {
            render({
              prompt: 'Apa persamaan dan perbedaan kedua sisi tegak ini?',
              info: [`${sisiName(sel[0])} ↔ ${sisiName(sel[1])}`],
              actions: [hintAction('Perhatikan bentuk dan ukuran kedua sisi tegak.'), catatAction('Catat Temuan'), backAction],
            })
          }})
        }
        actions.push(hintAction('Perhatikan bentuk dan ukuran kedua sisi tegak.'))
        render({
          prompt: `${sisiName(i)} ditandai. Bentuk apa yang kamu lihat pada sisi tegak ini?`,
          info: [`Sisi tegak yang kamu tandai: ${sel.map(sisiName).join(', ')}`],
          actions,
        })
      }
      const actions0 = () => [hintAction('Perhatikan bentuk dan ukuran kedua sisi tegak.')]
    },

    // A3 Banyak Sisi Tegak: numbered badges in tap order; re-tapping never adds; no total shown.
    'banyak-sisi-tegak': () => {
      const order = []
      render({prompt: 'Telusuri sisi-sisi yang bertemu di puncak limas dengan mengetuknya satu per satu. Berapa banyak sisi yang bertemu di puncak?'})
      tapHandler = (i) => {
        if (i === 0) {
          render({prompt: 'Itu alas limas. Ketuk sisi yang bertemu di puncak.'})
          return
        }
        S.lateralSeen = true
        if (order.includes(i)) {
          return
        }
        order.push(i)
        S.selectedFaces = order.map((id, k) => ({id, order: k + 1}))
        view(Object.fromEntries(order.map((id) => [id, 'a'])))
        sceneModule.setFaceOrderLabels(order)
        render({
          prompt: 'Lanjutkan mengetuk sisi lain yang bertemu di puncak. Berapa banyak sisi yang kamu temukan?',
          actions: [catatAction()],
        })
      }
    },

    // A4 Ukuran Alas
    'ukuran-alas': () => {
      const list = () => Object.entries(S.baseEdgeMeasurements).map(([e, cm]) => `Rusuk alas ${Number(e) + 1}: ${cm} cm`)
      render({prompt: 'Ketuk alas limas untuk menandainya. Putar model jika alas belum terlihat.'})
      tapHandler = (i) => {
        if (i !== 0) {
          render({prompt: 'Itu bukan alas. Ketuk bagian alas limas.'})
          return
        }
        S.baseSeen = true
        view({0: 'a'})
        render({
          prompt: 'Alas ditandai.',
          actions: [{label: 'Pilih Bagian yang Akan Diukur', primary: true, onClick: () => {
            tapHandler = null
            sceneModule.setMeasureFace(0)
            edgeHandler = ({edgeIndex, lengthCm}) => {
              S.baseEdgeMeasurements[edgeIndex] = lengthCm
              render({prompt: 'Ketuk rusuk alas lain jika perlu, lalu catat temuanmu.', info: list(), actions: [catatAction()]})
            }
            render({prompt: 'Ketuk rusuk alas yang ingin kamu ukur.'})
          }}],
        })
      }
    },

    // A5 Ukuran pada Sisi Tegak
    'ukuran-sisi-tegak': () => {
      const compareHeights = (id) => {
        const cm = sceneModule.showPyramidHeight(true)
        render({
          prompt: 'Apakah tinggi limas dan tinggi segitiga sisi tegak sama? Jelaskan berdasarkan posisi ruas garisnya.',
          info: [
            `Garis putus-putus (biru muda) = tinggi limas: ${cm} cm`,
            `Garis lurus (kuning) dengan tanda siku-siku = tinggi segitiga pada ${sisiName(id)}: ${lateral(id).triangleHeight} cm`,
          ],
          actions: [catatAction(), {label: 'Amati Sisi Tegak Lain', onClick: () => startAspect('ukuran-sisi-tegak')}],
        })
      }
      const onBoth = (id, info) => {
        render({
          prompt: 'Bagaimana kedua ukuran ini dapat membantu menentukan luas sisi tegak?',
          info,
          actions: [
            {label: 'Amati Sisi Tegak Lain', onClick: () => startAspect('ukuran-sisi-tegak')},
            // Bandingkan Tinggi is optional and only offered from A5 (OQ-6).
            {label: 'Bandingkan Tinggi', onClick: () => compareHeights(id)},
            catatAction(),
          ],
        })
      }
      pickLateral('Ketuk salah satu sisi tegak yang ingin kamu ukur.', (id) => measureLateral(id, onBoth))
    },

    // A6 Luas Alas: only sizes are shown, never the area value.
    'luas-alas': () => {
      S.baseSeen = true
      view({0: 'a'})
      sceneModule.setMeasureFace(0)
      sceneModule.getEdgeLengths(0).forEach((cm, e) => {
        S.baseEdgeMeasurements[e] = cm
      })
      const info = Object.entries(S.baseEdgeMeasurements).map(([e, cm]) => `Rusuk alas ${Number(e) + 1}: ${cm} cm`)
      render({
        prompt: 'Amati bentuk dan ukuran alas yang sudah kamu peroleh.',
        info,
        actions: [{label: 'Lanjut', primary: true, onClick: () => render({
          prompt: 'Bagaimana menentukan luas alas? Hitung bersama kelompokmu, lalu catat di e-module.',
          info,
          actions: [catatAction()],
        })}],
      })
    },

    // A7 Luas Setiap Sisi Tegak: branches on whether lateralMeasurements[faceId] already exists.
    'luas-sisi-tegak': () => {
      const afterData = (id, info) => {
        render({
          prompt: 'Berdasarkan bentuk dan ukuran, bagaimana menentukan luasnya? AR tidak menampilkan hasil luas; hitung dan catat di e-module.',
          info,
          actions: [catatAction('Catat Temuan')],
        })
      }
      pickLateral('Ketuk salah satu sisi tegak yang ingin kamu selidiki luasnya.', (id) => {
        view(onlyFace(id))
        if (hasBothMeasures(id)) {
          render({
            prompt: `Data Ukuran Sudah Tersedia untuk ${sisiName(id)}.`,
            actions: [
              {label: 'Gunakan Data Sebelumnya', primary: true, onClick: () => afterData(id, revealLateral(id))},
              {label: 'Ukur Kembali', onClick: () => {
                delete S.lateralMeasurements[id]
                sceneModule.hideFaceEdge(id, 0)
                sceneModule.hideHeightLine(id)
                measureLateral(id, afterData)
              }},
            ],
          })
        } else {
          render({
            prompt: `Data Ukuran Belum Tersedia untuk ${sisiName(id)}.`,
            actions: [{label: 'Ukur Sisi Ini', primary: true, onClick: () => measureLateral(id, afterData)}],
          })
        }
      })
    },

    // A8 Hubungan Alas & Sisi Tegak: alas and one sisi tegak highlighted with different styles.
    hubungan: () => {
      const picked = {base: false, side: null}
      render({prompt: 'Bagian apa saja yang membentuk permukaan limas ini? Ketuk alas, lalu ketuk salah satu sisi tegak.'})
      tapHandler = (i) => {
        if (i === 0) {
          picked.base = true
          S.baseSeen = true
        } else {
          picked.side = i
          S.lateralSeen = true
        }
        const styles = {}
        if (picked.base) {
          styles[0] = 'a'
        }
        if (picked.side) {
          styles[picked.side] = 'b'
        }
        view(styles)
        if (!(picked.base && picked.side)) {
          render({prompt: picked.base ? 'Alas ditandai. Sekarang ketuk satu sisi tegak.' : 'Sisi tegak ditandai. Sekarang ketuk alas.'})
          return
        }
        render({
          prompt: 'Informasi apa yang kamu ketahui tentang alas dan sisi tegak sebagai bagian dari permukaan limas?',
          info: [`Alas ↔ ${sisiName(picked.side)}`],
          actions: [{label: 'Lanjut', primary: true, onClick: () => render({
            prompt: 'Catat hubungan yang kamu temukan untuk digunakan pada tahap berikutnya.',
            info: [`Alas ↔ ${sisiName(picked.side)}`],
            actions: [catatAction()],
          })}],
        })
      }
    },

    // A9 Pola Lain: free exploration, no guided steps (model controls are always active).
    lainnya: () => {
      sceneModule.setAspectTarget('sisi')
      render({
        prompt: 'Adakah pola atau informasi lain yang kamu temukan? Jelajahi model dengan bebas: putar, geser, perbesar, dan ketuk bidangnya.',
        actions: [catatAction()],
      })
    },
  }

  const startAspect = (aspectId) => {
    activeAspect = ASPECTS.find((a) => a.id === aspectId)
    hintOn = false
    hintText = ''
    S.selectedFaces = []
    if (!S.observedAspects.includes(aspectId)) {
      S.observedAspects.push(aspectId)
    }
    clearScene()
    sceneModule.setAspectTarget('sisi-select')
    ASPECT_FLOWS[aspectId]()
    openBar()
  }

  // --- Catat Temuanmu (4.8) ---
  const goCatat = () => {
    S.findingsRecorded[activeAspect.id] = true // boolean only; the text is written in the e-module
    clearScene()
    $('btn-m4-lanjut-antrean').classList.toggle('hidden', queue.length === 0)
    const repeat = $('btn-m4-ulang')
    repeat.textContent = activeAspect.repeatLabel || ''
    repeat.classList.toggle('hidden', !activeAspect.repeatLabel)
    $('btn-m4-geogebra-catat').classList.toggle('hidden', !geogebraReady())
    showScreen('screen-catat-m4')
  }

  $('btn-m4-lanjut-antrean').addEventListener('click', () => startAspect(queue.shift()))
  $('btn-m4-ulang').addEventListener('click', () => startAspect(activeAspect.id))
  $('btn-m4-amati-lain').addEventListener('click', showMenu)
  $('btn-m4-cek-catat').addEventListener('click', () => openKecukupan())
  $('btn-m4-kembali-menu').addEventListener('click', showMenu)
  $('btn-m4-kecukupan').addEventListener('click', () => openKecukupan())

  // --- Jembatan GeoGebra (4.7): only reachable once alas AND a sisi tegak have been observed ---
  let geogebraStep = 0
  const openGeogebra = () => {
    if (!geogebraReady()) {
      return
    }
    geogebraStep = 0
    $('geogebra-prompt-m4').textContent = GEOGEBRA_STEPS[0]
    $('btn-geogebra-lanjut-m4').classList.remove('hidden')
    showScreen('screen-geogebra-m4')
  }
  $('btn-geogebra-menu-m4').addEventListener('click', openGeogebra)
  $('btn-m4-geogebra-catat').addEventListener('click', openGeogebra)
  $('btn-geogebra-lanjut-m4').addEventListener('click', () => {
    geogebraStep += 1
    $('geogebra-prompt-m4').textContent = GEOGEBRA_STEPS[geogebraStep]
    if (geogebraStep >= GEOGEBRA_STEPS.length - 1) {
      $('btn-geogebra-lanjut-m4').classList.add('hidden')
    }
  })
  $('btn-geogebra-tutup-m4').addEventListener('click', showMenu)

  // --- Periksa Kecukupan Data (4.9) ---
  const openKecukupan = () => {
    clearScene()
    $('kecukupan-step1-m4').classList.remove('hidden')
    $('kecukupan-step2-m4').classList.add('hidden')
    showScreen('screen-kecukupan-m4')
  }
  $('btn-menu-kecukupan-m4').addEventListener('click', openKecukupan)
  $('btn-kecukupan-kembali-m4').addEventListener('click', showMenu)

  $('btn-sudah-cukup-m4').addEventListener('click', () => {
    S.sufficiency = 'cukup'
    showScreen('screen-selesai-m4')
  })
  $('btn-perlu-tambahan-m4').addEventListener('click', () => {
    S.sufficiency = 'perlu'
    $('kecukupan-step1-m4').classList.add('hidden')
    $('kecukupan-step2-m4').classList.remove('hidden')
  })
  $('btn-amati-aspek-lain-m4').addEventListener('click', showMenu)
  $('btn-bandingkan-limas-m4').addEventListener('click', () => {
    saveTransform()
    comparePendingFrom = S.pyramidType
    showPilihLimas()
  })

  // --- Layar Penutup (4.11) ---
  $('btn-selesai-m4').addEventListener('click', () => {
    if (TAHAP_4_URL) {
      window.location.href = TAHAP_4_URL
      return
    }
    showScreen('screen-awal-m4')
  })

  showScreen('screen-awal-m4')
}
