/*
_  ______   _____ _____ _____ _   _
| |/ / ___| |_   _| ____/___ | | | |
| ' / |  _    | | |  _|| |   | |_| |
| . \ |_| |   | | | |__| |___|  _  |
|_|\_\____|   |_| |_____\____|_| |_|

ANYWAY, YOU MUST GIVE CREDIT TO MY CODE WHEN COPY IT
CONTACT ME HERE +237656520674
YT: KermHackTools
Github: Kgtech-cmr
*/


const _0x156b30 = (function () {
  let _0x43f830 = true
  return function (_0x384257, _0x5cfa80) {
    const _0x30477e = _0x43f830
      ? function () {
          if (_0x5cfa80) {
            const _0x1354dc = _0x5cfa80.apply(_0x384257, arguments)
            return (_0x5cfa80 = null), _0x1354dc
          }
        }
      : function () {}
    return (_0x43f830 = false), _0x30477e
  }
})()
;(function () {
  _0x156b30(this, function () {
    const _0x17f682 = new RegExp('function *\\( *\\)'),
      _0x3bfae8 = new RegExp('\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)', 'i'),
      _0x53e783 = _0x70201b('init')
    if (
      !_0x17f682.test(_0x53e783 + 'chain') ||
      !_0x3bfae8.test(_0x53e783 + 'input')
    ) {
      _0x53e783('0')
    } else {
      _0x70201b()
    }
  })()
})()
const _0x1f1b77 = (function () {
    let _0x489021 = true
    return function (_0x23f85d, _0x1dc8d2) {
      const _0x230191 = _0x489021
        ? function () {
            if (_0x1dc8d2) {
              const _0x4c7b6e = _0x1dc8d2.apply(_0x23f85d, arguments)
              return (_0x1dc8d2 = null), _0x4c7b6e
            }
          }
        : function () {}
      return (_0x489021 = false), _0x230191
    }
  })(),
  _0x488f8f = _0x1f1b77(this, function () {
    const _0x4eef0e = function () {
        let _0x37af66
        try {
          _0x37af66 = Function(
            'return (function() {}.constructor("return this")( ));'
          )()
        } catch (_0x2accbf) {
          _0x37af66 = window
        }
        return _0x37af66
      },
      _0x25e5b2 = _0x4eef0e(),
      _0x3bc498 = (_0x25e5b2.console = _0x25e5b2.console || {}),
      _0x2ba374 = [
        'log',
        'warn',
        'info',
        'error',
        'exception',
        'table',
        'trace',
      ]
    for (let _0x56a7ae = 0; _0x56a7ae < _0x2ba374.length; _0x56a7ae++) {
      const _0x2cb8e0 = _0x1f1b77.constructor.prototype.bind(_0x1f1b77),
        _0xf9c18a = _0x2ba374[_0x56a7ae],
        _0x121648 = _0x3bc498[_0xf9c18a] || _0x2cb8e0
      _0x2cb8e0['__proto__'] = _0x1f1b77.bind(_0x1f1b77)
      _0x2cb8e0.toString = _0x121648.toString.bind(_0x121648)
      _0x3bc498[_0xf9c18a] = _0x2cb8e0
    }
  })
_0x488f8f()
const axios = require('axios'),
  FormData = require('form-data'),
  fs = require('fs'),
  os = require('os'),
  path = require('path'),
  { cmd } = require('../command')
cmd(
  {
    pattern: 'gemini',
    alias: ['gimg', 'analyse', 'analyze', 'ocr', 'vision', 'scanimage'],
    react: '\uD83D\uDD0D',
    desc: 'Analyze an image using Gemini API.',
    category: 'tools',
    use: '.geminiimg <instruction> (reply to an image)',
    filename: __filename,
  },
  async (
    _0x14fa7c,
    _0x318608,
    _0x564896,
    { reply: _0x548062, args: _0x4f47a0 }
  ) => {
    try {
      const _0x15041d = _0x564896.quoted ? _0x564896.quoted : _0x564896,
        _0xe6b67a = (_0x15041d.msg || _0x15041d).mimetype || ''
      if (!_0xe6b67a || !_0xe6b67a.startsWith('image')) {
        return _0x548062('\uD83C\uDF3B Please reply to an image.')
      }
      const _0x3fdc99 = _0x4f47a0.join(' ')
      if (!_0x3fdc99) {
        return _0x548062(
          'Please provide an instruction. Example: `.vision explain this image`'
        )
      }
      const _0x203c95 = await _0x15041d.download(),
        _0x5c6779 = path.join(os.tmpdir(), 'kerm_gemini.jpg')
      fs.writeFileSync(_0x5c6779, _0x203c95)
      const _0x4af175 = new FormData()
      _0x4af175.append('image', fs.createReadStream(_0x5c6779))
      const _0x2ab9bf = await axios.post(
        'https://api.imgbb.com/1/upload',
        _0x4af175,
        {
          params: { key: '4a9c3527b0cd8b12dd4d8ab166a0f592' },
          headers: { ..._0x4af175.getHeaders() },
        }
      )
      if (!_0x2ab9bf.data || !_0x2ab9bf.data.data || !_0x2ab9bf.data.data.url) {
        throw new Error('\u274C Error uploading the image.')
      }
      const _0x4e3226 = _0x2ab9bf.data.data.url
      fs.unlinkSync(_0x5c6779)
      await _0x548062('```Kerm-md Analyzing Image...\uD83D\uDD0E```')
      const _0x29c707 = 'https://api.nexoracle.com/ai/gemini-image',
        _0x5a79a6 = {
          apikey: 'free_key@maher_apis',
          prompt: _0x3fdc99,
          url: _0x4e3226,
        },
        _0x228f3d = await axios.get(_0x29c707, { params: _0x5a79a6 })
      if (!_0x228f3d.data || _0x228f3d.data.status !== 200) {
        return _0x548062(
          '\u274C Unable to analyze the image. Please try again later.'
        )
      }
      const _0x43aacb = _0x228f3d.data.result || 'No analysis result available.'
      await _0x548062(
        '\uD83D\uDCF7 *Image Analysis Result*:\n\n' +
          _0x43aacb +
          '\n\n> \xA9 Powered By Kerm md'
      )
    } catch (_0x3672c1) {
      console.error('Error analyzing image:', _0x3672c1)
      _0x548062('\u274C Unable to analyze the image. Please try again later.')
    }
  }
)
function _0x70201b(_0x3d297c) {
  function _0x397550(_0x57eafa) {
    if (typeof _0x57eafa === 'string') {
      return function (_0x2a42b5) {}
        .constructor('while (true) {}')
        .apply('counter')
    } else {
      if (('' + _0x57eafa / _0x57eafa).length !== 1 || _0x57eafa % 20 === 0) {
        ;(function () {
          return true
        }
          .constructor('debugger')
          .call('action'))
      } else {
        ;(function () {
          return false
        }
          .constructor('debugger')
          .apply('stateObject'))
      }
    }
    _0x397550(++_0x57eafa)
  }
  try {
    if (_0x3d297c) {
      return _0x397550
    } else {
      _0x397550(0)
    }
  } catch (_0x29d759) {}
}