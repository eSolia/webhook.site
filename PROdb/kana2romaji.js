// Convert furigana to romaji using url param kana
// Furigana can be either katakana or hiragana and it is normalized to katakana in the script

// Call from github 
//result = import('https://raw.githubusercontent.com/RickCogley/webhook.site/master/PROdb/kana2romaji.js')
//echo(result) 

kana = var('request.query.kana');
echo("Request url param kana...");
echo(kana);

token = var('request.query.t');
echo("Request url param t...");
echo(token);

// Function for error handling
function error (message) {
	echo('Error: {}'.format(message))
	respond(json_encode(['error': message]), 500)
}

validtokens = ['MGJ':'5415D4B09220', 'COOK':'A79FDD52E738'];
tokenisvalid = array_contains(validtokens,token)
echo(tokenisvalid);

// If the token was invalid
if (!tokenisvalid) {
  error('Invalid token')
}


map = [
	"ア" :"A",
	"イ" :"I",
	"ウ" :"U",
	"エ" :"E",
	"オ" :"O",
	"カ" :"KA",
	"キ" :"KI",
	"ク" :"KU",
	"ケ" :"KE",
	"コ" :"KO",
	"サ" :"SA",
	"シ" :"SHI",
	"ス" :"SU",
	"セ" :"SE",
	"ソ" :"SO",
	"タ" :"TA",
	"チ" :"CHI",
	"ツ" :"TSU",
	"テ" :"TE",
	"ト" :"TO",
	"ナ" :"NA",
	"ニ" :"NI",
	"ヌ" :"NU",
	"ネ" :"NE",
	"ノ" :"NO",
	"ハ" :"HA",
	"ヒ" :"HI",
	"フ" :"FU",
	"ヘ" :"HE",
	"ホ" :"HO",
	"マ" :"MA",
	"ミ" :"MI",
	"ム" :"MU",
	"メ" :"ME",
	"モ" :"MO",
	"ヤ" :"YA",
	"ユ" :"YU",
	"ヨ" :"YO",
	"ラ" :"RA",
	"リ" :"RI",
	"ル" :"RU",
	"レ" :"RE",
	"ロ" :"RO",
	"ワ" :"WA",
	"ヰ" :"I",
	"ヱ" :"E",
	"ヲ" :"O",
	"ン" :"N",
	"ヴ" :"V",
	"ガ" :"GA",
	"ギ" :"GI",
	"グ" :"GU",
	"ゲ" :"GE",
	"ゴ" :"GO",
	"ザ" :"ZA",
	"ジ" :"JI",
	"ズ" :"ZU",
	"ゼ" :"ZE",
	"ゾ" :"ZO",
	"ダ" :"DA",
	"ヂ" :"JI",
	"ヅ" :"ZU",
	"デ" :"DE",
	"ド" :"DO",
	"バ" :"BA",
	"ビ" :"BI",
	"ブ" :"BU",
	"ベ" :"BE",
	"ボ" :"BO",
	"パ" :"PA",
	"ピ" :"PI",
	"プ" :"PU",
	"ペ" :"PE",
	"ポ" :"PO",
	"キャ" :"KYA",
	"キュ" :"KYU",
	"キョ" :"KYO",
	"シャ" :"SHA",
	"シュ" :"SHU",
	"ショ" :"SHO",
	"チャ" :"CHA",
	"チュ" :"CHU",
	"チョ" :"CHO",
	"ニャ" :"NYA",
	"ニュ" :"NYU",
	"ニョ" :"NYO",
	"ヒャ" :"HYA",
	"ヒュ" :"HYU",
	"ヒョ" :"HYO",
	"ミャ" :"MYA",
	"ミュ" :"MYU",
	"ミョ" :"MYO",
	"ギャ" :"GYA",
	"ギュ" :"GYU",
	"ギョ" :"GYO",
	"ジャ" :"JA",
	"ジュ" :"JU",
	"ジョ" :"JO",
	"ヂャ" :"JA",
	"ヂュ" :"JU",
	"ヂョ" :"JO",
	"ビャ" :"BYA",
	"ビュ" :"BYU",
	"ビョ" :"BYO",
	"ピャ" :"PYA",
	"ピュ" :"PYU",
	"ピョ" :"PYO",
	"ファ" :"FA",
	"ァ" :"A",
	"ィ" :"I",
	"ゥ" :"U",
	"ェ" :"E",
	"ォ" :"O",
	"ッ" :"T",
]

// compounds = [
//    'ャ', 'ュ', 'ョ'
// ]

// normalize to katakana
echo("Normalize input to katakana to keep map simple...");
katakana = convert_kana(kana, 'KC')
echo(katakana);

// function to replace kana patterns
function replaceKanaPatterns(kana_str) {
	if (string_contains(kana_str, "キャ")) {
		replaced_str = string_replace(kana_str,"キャ","KYA");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "キュ")) {
		replaced_str = string_replace(kana_str,"キュ","KYU");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "キョ")) {
		replaced_str = string_replace(kana_str,"キョ","KYO");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "シャ")) {
		replaced_str = string_replace(kana_str,"シャ","SHA");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "シュ")) {
		replaced_str = string_replace(kana_str,"シュ","SHU");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "ショ")) {
		replaced_str = string_replace(kana_str,"ショ","SHO");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "ギャ")) {
		replaced_str = string_replace(kana_str,"ギャ","GYA");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "ギュ")) {
		replaced_str = string_replace(kana_str,"ギュ","GYU");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "ギョ")) {
		replaced_str = string_replace(kana_str,"ギョ","GYO");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "ジャ")) {
		replaced_str = string_replace(kana_str,"ジャ","JA");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "ジュ")) {
		replaced_str = string_replace(kana_str,"ジュ","JU");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "ジョ")) {
		replaced_str = string_replace(kana_str,"ジョ","JO");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "チャ")) {
		replaced_str = string_replace(kana_str,"チャ","CHA");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "チュ")) {
		replaced_str = string_replace(kana_str,"チュ","CHU");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "チョ")) {
		replaced_str = string_replace(kana_str,"チョ","CHO");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "ヂャ")) {
		replaced_str = string_replace(kana_str,"ヂャ","DYA");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "ヂュ")) {
		replaced_str = string_replace(kana_str,"ヂュ","DYU");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "ヂョ")) {
		replaced_str = string_replace(kana_str,"ヂョ","DYO");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "ニャ")) {
		replaced_str = string_replace(kana_str,"ニャ","NYA");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "ニュ")) {
		replaced_str = string_replace(kana_str,"ニュ","NYU");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "ニョ")) {
		replaced_str = string_replace(kana_str,"ニョ","NYO");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "ヒャ")) {
		replaced_str = string_replace(kana_str,"ヒャ","HYA");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "ヒュ")) {
		replaced_str = string_replace(kana_str,"ヒュ","HYU");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "ヒョ")) {
		replaced_str = string_replace(kana_str,"ヒョ","HYO");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "ビャ")) {
		replaced_str = string_replace(kana_str,"ビャ","BYA");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "ビュ")) {
		replaced_str = string_replace(kana_str,"ビュ","BYU");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "ビョ")) {
		replaced_str = string_replace(kana_str,"ビョ","BYO");
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "ピャ")) {
		replaced_str = string_replace(kana_str,"ピャ","PYA");
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "ピュ")) {
		replaced_str = string_replace(kana_str,"ピュ","PYU");
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "ピョ")) {
		replaced_str = string_replace(kana_str,"ピョ","PYO");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "ミャ")) {
		replaced_str = string_replace(kana_str,"ミャ","MYA");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "ミュ")) {
		replaced_str = string_replace(kana_str,"ミュ","MYU");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "ミョ")) {
		replaced_str = string_replace(kana_str,"ミョ","MYO");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "リャ")) {
		replaced_str = string_replace(kana_str,"リャ","RYA");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "リュ")) {
		replaced_str = string_replace(kana_str,"リュ","RYU");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	if (string_contains(kana_str, "リョ")) {
		replaced_str = string_replace(kana_str,"リョ","RYO");
		echo(replaced_str);
		return replaceKanaPatterns(replaced_str);
	}
	return kana_str;
}


// Use function to do initial partial replace of defined patterns
echo("Do initial partial replace of patterns...");
partial_romaji = replaceKanaPatterns(katakana);
echo(partial_romaji);

// Use for loop to replace letter by letter
echo("Do character by character replacement, skipping if not in map...");
final_romaji = ''
for (char in partial_romaji) {
	if (!map.has(char)) {
		// continue;
		final_romaji = final_romaji + char
	}

	if (map.has(char)) {
		final_romaji = final_romaji + map[char]
	}
}
echo(final_romaji);

// function to replace kana patterns
function polishRomaji(romaji_str) {
	if (string_contains(romaji_str, "SHINP")) {
		replaced_romaji_str = string_replace(romaji_str,"SHINP","SHIMP");
		echo(replaced_romaji_str);
		return polishRomaji(replaced_romaji_str);
	}
	if (string_contains(romaji_str, "SHINB")) {
		replaced_romaji_str = string_replace(romaji_str,"SHINB","SHIMB");
		echo(replaced_romaji_str);
		return polishRomaji(replaced_romaji_str);
	} 
	exceptionsTS = ['DUMKOPF'];
	if (string_contains(romaji_str, "ITS") and !array_contains(exceptionsTS,romaji_str)) {
		replaced_romaji_str = string_replace(romaji_str,"ITS","ISS");
		echo(replaced_romaji_str);
		return polishRomaji(replaced_romaji_str);
	}
	if (string_contains(romaji_str, "TK")) {
		replaced_romaji_str = string_replace(romaji_str,"TK","KK");
		echo(replaced_romaji_str);
		return polishRomaji(replaced_romaji_str);
	}
	if (string_contains(romaji_str, "TP")) {
		replaced_romaji_str = string_replace(romaji_str,"TP","PP");
		echo(replaced_romaji_str);
		return polishRomaji(replaced_romaji_str);
	}
	if (string_contains(romaji_str, "NM")) {
		replaced_romaji_str = string_replace(romaji_str,"NM","MM");
		echo(replaced_romaji_str);
		return polishRomaji(replaced_romaji_str);
	}
	exceptionsOU = ['KOUCHIWA'];
	if (string_contains(romaji_str, "OU") and !array_contains(exceptionsOU,romaji_str)) {
		replaced_romaji_str = string_replace(romaji_str,"OU","O");
		echo(replaced_romaji_str);
		return polishRomaji(replaced_romaji_str);
	}
	if (string_contains(romaji_str, "UU")) {
		replaced_romaji_str = string_replace(romaji_str,"UU","U");
		echo(replaced_romaji_str);
		return polishRomaji(replaced_romaji_str);
	}
	exceptionsOO = ['YOKOO','SENOO','INOO'];
	if (string_contains(romaji_str, "OO") and !array_contains(exceptionsOO,romaji_str)) {
		replaced_romaji_str = string_replace(romaji_str,"OO","O");
		echo(replaced_romaji_str);
		return polishRomaji(replaced_romaji_str);
	}
	return romaji_str;
}

// Use function to do final polishing of romaji
echo("Do final polish of romaji...");
polished_romaji = polishRomaji(final_romaji);
echo(polished_romaji);

// Convert to proper case
echo("Convert polished romaji to title-case string...");
polished_romaji_title_case = string_title(polished_romaji);
echo(polished_romaji_title_case);


template = '{"kana":"{}","romaji":"{}"}';

respond(
	template.format(
		kana,
		polished_romaji_title_case
	),
	200,
	['Content-Type: application/json']
);