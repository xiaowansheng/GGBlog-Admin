<script setup lang="ts">
import { ref, onMounted, Ref, onActivated, onBeforeUnmount, onDeactivated, unref ,nextTick} from "vue";
import Vditor from "vditor";
import "vditor/dist/index.css";
import { toRefs } from "@vueuse/core";
import { buildUUID, ElRef } from "@pureadmin/utils";
import {getOss} from "@/api/upload"
import axios from "axios";

const ossUrl=import.meta.env.VITE_GLOB_OSS_URL
const props = defineProps({
  value: {
    type: String,
    default: "",
    required: true
  },
  height: { type: Number, default: 360 },
  dir: {
    type: String,
    default:"default"
  }
});
const emits = defineEmits(["change", "get", "update:value"]);
const { value, height,dir } = toRefs(props);
// markdown实例
const vditor = ref<Vditor | null>(null);
// div元素引用
const contentRef = ref<ElRef>(null);
    // 保存markdown文本
const valueRef = ref<string>(value.value);
// 是否在初始化
const initedRef = ref(false);
const uploadForm = {
  policy: "",
  signature: "",
  ossaccessKeyId: "",
  key: "",
  dir: "",
  host: ""
};
function beforeUpload() {
  return new Promise((resolve, reject) => {
    getOss(dir.value)
      .then((data:any) => {
        console.log("oss:", data);
        // console.log('uploadForm', uploadForm);
        // uploadForm.value = data;
        uploadForm.policy = data.policy;
        uploadForm.signature = data.signature;
        uploadForm.ossaccessKeyId = data.accessid;
        uploadForm.key = data.dir + "/" + buildUUID() + "_${filename}";
        uploadForm.dir = data.dir;
        uploadForm.host = data.host;
        resolve(uploadForm);
      })
      .catch(error => {
        reject(error);
      });
  });
}
function upload(formData: FormData): Promise<any> {
  return axios({
    method: "post",
    url: ossUrl,
    data: formData
  });
}
const init=()=> {
  const contentElement = unref(contentRef) as HTMLElement;
  // contentElement.style.height=height.value+"px"
  console.log("init markdown");
  
  if (!contentElement) return;
  console.log("contentElement",contentElement);
  let toolbar;
  if (window.innerWidth < 768 || window.innerWidth >= 768) {
    toolbar = [
      "emoji",
      "headings",
      "bold",
      "italic",
      "strike",
      "link",
      "|",
      "list",
      "ordered-list",
      "check",
      "outdent",
      "indent",
      "|",
      "quote",
      "line",
      "code",
      "inline-code",
      "insert-before",
      "insert-after",
      "|",
      "upload",
      "record",
      "table",
      "|",
      "undo",
      "redo",
      "|",
      "fullscreen",
      "edit-mode",
      {
        name: "more",
        toolbar: [
          "both",
          "code-theme",
          "content-theme",
          "export",
          "outline",
          "preview",
          "devtools",
          "info",
          "help"
        ]
      }
    ];
  }
  vditor.value= new Vditor(contentElement, {
    toolbar,
    toolbarConfig: {
      pin: true
    },
    height:height.value,
    // theme: getDarkMode.value === 'dark' ? 'dark' : 'classic',
    // 设置外观主题
    // theme:"",
    // lang: "",
    mode: "ir",
    fullscreen: {
      index: 520
    },
    counter: {
      enable: true
    },
    comment: {
      enable: false
    },
    cache: {
      enable: false
      // id: 'markdown',
      // after(html: string): string {
      //   console.log('markdown缓存成功', html);
      //   return html;
      // },
    },
    preview: {
      // theme: {
      //   // 设置内容主题
      // },
      actions: [],
      hljs: {
        lineNumber: true
        // 设置代码块主题
      },
      markdown: {
        paragraphBeginningSpace: false,
        mark: true,
        sanitize: false,
        listStyle: true
        // "toc": true,
      }
    },
    hint: {
      emoji: {
        "+1": "👍",
        "-1": "👎",
        "100": "💯",
        "1st_place_medal": "🥇",
        "2nd_place_medal": "🥈",
        "3rd_place_medal": "🥉",
        "8ball": "🎱",
        a: "🅰️",
        ab: "🆎",
        abc: "🔤",
        abcd: "🔡",
        Accept: "🉑",
        aerial_tramway: "🚡",
        airplane: "✈️",
        alarm_clock: "⏰",
        alembic: "⚗️",
        alien: "👽",
        ambulance: "🚑",
        amphora: "🏺",
        anchor: "⚓️",
        angel: "👼",
        anger: "💢",
        angry: "😠",
        anguished: "😧",
        ant: "🐜",
        apple: "🍎",
        aquarius: "♒️",
        aries: "♈️",
        arrow_backward: "◀️",
        arrow_double_down: "⏬",
        arrow_double_up: "⏫",
        arrow_down: "⬇️",
        arrow_down_small: "🔽",
        arrow_forward: "▶️",
        arrow_heading_down: "⤵️",
        arrow_heading_up: "⤴️",
        arrow_left: "⬅️",
        arrow_lower_left: "↙️",
        arrow_lower_right: "↘️",
        arrow_right: "➡️",
        arrow_right_hook: "↪️",
        arrow_up: "⬆️",
        arrow_up_down: "↕️",
        arrow_up_small: "🔼",
        arrow_upper_left: "↖️",
        arrow_upper_right: "↗️",
        arrows_clockwise: "🔃",
        arrows_counterclockwise: "🔄",
        art: "🎨",
        articulated_lorry: "🚛",
        asterisk: "*️⃣",
        astonished: "😲",
        athletic_shoe: "👟",
        atm: "🏧",
        baby: "👶",
        baby_bottle: "🍼",
        baby_chick: "🐤",
        baby_symbol: "🚼",
        back: "🔙",
        bacon: "🥓",
        badminton: "🏸",
        baggage_claim: "🛄",
        baguette_bread: "🥖",
        balance_scale: "⚖️",
        balloon: "🎈",
        ballot_box_with_check: "☑️",
        bamboo: "🎍",
        banana: "🍌",
        bank: "🏦",
        bar_chart: "📊",
        barber: "💈",
        baseball: "⚾️",
        basketball: "🏀",
        basketball_man: "⛹",
        basketball_woman: "⛹️‍♀️",
        bat: "🦇",
        bath: "🛀",
        bathtub: "🛁",
        battery: "🔋",
        beach_umbrella: "🏖",
        bear: "🐻",
        bed: "🛏",
        bee: "🐝",
        beer: "🍺",
        beers: "🍻",
        beetle: "🐞",
        beginner: "🔰",
        bell: "🔔",
        bento: "🍱",
        bicyclist: "🚴",
        bike: "🚲",
        biking_man: "🚴",
        biking_woman: "🚴‍♀",
        blonde_man: "👱",
        blonde_woman: "👱‍♀",
        blossom: "🌼",
        blowfish: "🐡",
        blue_book: "📘",
        blush: "😊",
        bouquet: "💐",
        bow: "🙇",
        bow_and_arrow: "🏹",
        bowing_man: "🙇",
        bowing_woman: "🙇‍♀",
        bowling: "🎳",
        boxing_glove: "🥊",
        boy: "👦",
        busstop: "🚏",
        bust_in_silhouette: "👤",
        busts_in_silhouette: "👥",
        butterfly: "🦋",
        cactus: "🌵",
        cake: "🍰",
        calendar: "📆",
        car: "🚗",
        card_file_box: "🗃",
        card_index: "📇",
        card_index_dividers: "🗂",
        carousel_horse: "🎠",
        carrot: "🥕",
        cat: "🐱",
        cat2: "🐈",
        cd: "💿",
        champagne: "🍾",
        chart: "💹",
        chart_with_downwards_trend: "📉",
        chart_with_upwards_trend: "📈",
        checkered_flag: "🏁",
        cheese: "🧀",
        cherries: "🍒",
        cherry_blossom: "🌸",
        chestnut: "🌰",
        chicken: "🐔",
        christmas_tree: "🎄",
        church: "⛪️",
        cinema: "🎦",
        circus_tent: "🎪",
        city_sunrise: "🌇",
        city_sunset: "🌆",
        cityscape: "🏙",
        clap: "👏",
        classical_building: "🏛",
        clinking_glasses: "🥂",
        clipboard: "📋",
        closed_book: "📕",
        closed_lock_with_key: "🔐",
        closed_umbrella: "🌂",
        cloud: "☁️",
        cloud_with_lightning: "🌩",
        cloud_with_lightning_and_rain: "⛈",
        cloud_with_rain: "🌧",
        cloud_with_snow: "🌨",
        clown_face: "🤡",
        coffee: "☕️",
        cold_sweat: "😰",
        confetti_ball: "🎊",
        confounded: "😖",
        confused: "😕",
        congo_brazzaville: "🇨🇬",
        congo_kinshasa: "🇨🇩",
        congratulations: "㊗️",
        construction: "🚧",
        construction_worker: "👷",
        construction_worker_man: "👷",
        construction_worker_woman: "👷‍♀",
        convenience_store: "🏪",
        cookie: "🍪",
        couple: "👫",
        couple_with_heart: "💑",
        couple_with_heart_man_man: "👨‍❤️‍👨",
        couple_with_heart_woman_man: "💑",
        couple_with_heart_woman_woman: "👩‍❤️‍👩",
        couplekiss_man_man: "👨‍❤️‍💋‍👨",
        couplekiss_man_woman: "💏",
        couplekiss_woman_woman: "👩‍❤️‍💋‍👩",
        cow: "🐮",
        cow2: "🐄",
        cowboy_hat_face: "🤠",
        croissant: "🥐",
        crossed_fingers: "🤞",
        crossed_flags: "🎌",
        crossed_swords: "⚔️",
        crown: "👑",
        cry: "😢",
        crying_cat_face: "😿",
        department_store: "🏬",
        derelict_house: "🏚",
        desert: "🏜",
        desert_island: "🏝",
        desktop_computer: "🖥",
        detective: "🕵",
        diamond_shape_with_a_dot_inside: "💠",
        diamonds: "♦️",
        disappointed: "😞",
        disappointed_relieved: "😥",
        dizzy: "💫",
        dizzy_face: "😵",
        djibouti: "🇩🇯",
        do_not_litter: "🚯",
        dog: "🐶",
        dog2: "🐕",
        doughnut: "🍩",
        dove: "🕊",
        dragon: "🐉",
        dragon_face: "🐲",
        dress: "👗",
        dromedary_camel: "🐪",
        drooling_face: "🤤",
        droplet: "💧",
        drum: "🥁",
        duck: "🦆",
        dvd: "📀",
        envelope: "✉️",
        envelope_with_arrow: "📩",
        euro: "💶",
        european_castle: "🏰",
        european_post_office: "🏤",
        evergreen_tree: "🌲",
        exclamation: "❗️",
        expressionless: "😑",
        eye: "👁",
        eye_speech_bubble: "👁‍🗨",
        eyeglasses: "👓",
        eyes: "👀",
        face_with_head_bandage: "🤕",
        face_with_thermometer: "🤒",
        facepunch: "👊",
        factory: "🏭",
        fallen_leaf: "🍂",
        family: "👪",
        family_man_boy: "👨‍👦",
        family_man_boy_boy: "👨‍👦‍👦",
        family_man_girl: "👨‍👧",
        family_man_girl_boy: "👨‍👧‍👦",
        family_man_girl_girl: "👨‍👧‍👧",
        family_man_man_boy: "👨‍👨‍👦",
        family_man_man_boy_boy: "👨‍👨‍👦‍👦",
        family_man_man_girl: "👨‍👨‍👧",
        family_man_man_girl_boy: "👨‍👨‍👧‍👦",
        family_man_man_girl_girl: "👨‍👨‍👧‍👧",
        family_man_woman_boy: "👪",
        family_man_woman_boy_boy: "👨‍👩‍👦‍👦",
        family_man_woman_girl: "👨‍👩‍👧",
        family_man_woman_girl_boy: "👨‍👩‍👧‍👦",
        family_man_woman_girl_girl: "👨‍👩‍👧‍👧",
        family_woman_boy: "👩‍👦",
        family_woman_boy_boy: "👩‍👦‍👦",
        family_woman_girl: "👩‍👧",
        family_woman_girl_boy: "👩‍👧‍👦",
        family_woman_girl_girl: "👩‍👧‍👧",
        family_woman_woman_boy: "👩‍👩‍👦",
        family_woman_woman_boy_boy: "👩‍👩‍👦‍👦",
        family_woman_woman_girl: "👩‍👩‍👧",
        family_woman_woman_girl_boy: "👩‍👩‍👧‍👦",
        family_woman_woman_girl_girl: "👩‍👩‍👧‍👧",
        fax: "📠",
        fearful: "😨",
        feet: "🐾",
        female_detective: "🕵️‍♀️",
        ferris_wheel: "🎡",
        ferry: "⛴",
        fire: "🔥",
        fire_engine: "🚒",
        fireworks: "🎆",
        first_quarter_moon: "🌓",
        first_quarter_moon_with_face: "🌛",
        fish: "🐟",
        fish_cake: "🍥",
        fishing_pole_and_fish: "🎣",
        fist: "✊",
        fist_left: "🤛",
        fist_oncoming: "👊",
        fist_raised: "✊",
        fist_right: "🤜",
        five: "5️⃣",
        flags: "🎏",
        flashlight: "🔦",
        fleur_de_lis: "⚜️",
        flight_arrival: "🛬",
        flight_departure: "🛫",
        flipper: "🐬",
        floppy_disk: "💾",
        flower_playing_cards: "🎴",
        flushed: "😳",
        fried_egg: "🍳",
        fried_shrimp: "🍤",
        fries: "🍟",
        frog: "🐸",
        frowning: "😦",
        frowning_face: "☹️",
        frowning_man: "🙍‍♂",
        frowning_woman: "🙍",
        fu: "🖕",
        fuelpump: "⛽️",
        full_moon: "🌕",
        full_moon_with_face: "🌝",
        gift: "🎁",
        gift_heart: "💝",
        girl: "👧",
        globe_with_meridians: "🌐",
        goal_net: "🥅",
        goat: "🐐",
        golf: "⛳️",
        golfing_man: "🏌",
        golfing_woman: "🏌️‍♀️",
        gorilla: "🦍",
        grapes: "🍇",
        green_apple: "🍏",
        green_book: "📗",
        green_heart: "💚",
        green_salad: "🥗",
        grey_exclamation: "❕",
        grey_question: "❔",
        grimacing: "😬",
        grin: "😁",
        grinning: "😀",
        hamster: "🐹",
        hand: "✋",
        headphones: "🎧",
        hear_no_evil: "🙉",
        heart: "❤️",
        heart_decoration: "💟",
        heart_eyes: "😍",
        heart_eyes_cat: "😻",
        heartbeat: "💓",
        heartpulse: "💗",
        hearts: "♥️",
        heavy_check_mark: "✔️",
        heavy_division_sign: "➗",
        heavy_dollar_sign: "💲",
        heavy_exclamation_mark: "❗️",
        heavy_heart_exclamation: "❣️",
        heavy_minus_sign: "➖",
        heavy_multiplication_x: "✖️",
        heavy_plus_sign: "➕",
        helicopter: "🚁",
        herb: "🌿",
        hibiscus: "🌺",
        high_brightness: "🔆",
        high_heel: "👠",
        hocho: "🔪",
        horse: "🐴",
        horse_racing: "🏇",
        hospital: "🏥",
        hot_pepper: "🌶",
        hotdog: "🌭",
        hotel: "🏨",
        hotsprings: "♨️",
        hourglass: "⌛️",
        hourglass_flowing_sand: "⏳",
        house: "🏠",
        house_with_garden: "🏡",
        hugs: "🤗",
        hushed: "😯",
        ice_cream: "🍨",
        icecream: "🍦",
        id: "🆔",
        ideograph_advantage: "🉐",
        imp: "👿",
        inbox_tray: "📥",
        information_desk_person: "💁",
        information_source: "ℹ️",
        innocent: "😇",
        interrobang: "⁉️",
        iphone: "📱",
        izakaya_lantern: "🏮",
        jack_o_lantern: "🎃",
        joy: "😂",
        joy_cat: "😹",
        kiss: "💋",
        kissing: "😗",
        kissing_cat: "😽",
        kissing_closed_eyes: "😚",
        kissing_heart: "😘",
        kissing_smiling_eyes: "😙",
        large_blue_circle: "🔵",
        large_blue_diamond: "🔷",
        large_orange_diamond: "🔶",
        last_quarter_moon: "🌗",
        last_quarter_moon_with_face: "🌜",
        latin_cross: "✝️",
        laughing: "😆",
        leaves: "🍃",
        ledger: "📒",
        lemon: "🍋",
        leo: "♌️",
        leopard: "🐆",
        libra: "♎️",
        light_rail: "🚈",
        link: "🔗",
        lion: "🦁",
        lips: "👄",
        lipstick: "💄",
        lizard: "🦎",
        lock: "🔒",
        lock_with_ink_pen: "🔏",
        lollipop: "🍭",
        loop: "➿",
        loud_sound: "🔊",
        loudspeaker: "📢",
        love_hotel: "🏩",
        love_letter: "💌",
        lying_face: "🤥",
        m: "Ⓜ️",
        mag: "🔍",
        mag_right: "🔎",
        man: "👨",
        man_artist: "👨‍🎨",
        man_astronaut: "👨‍🚀",
        man_cartwheeling: "🤸‍♂",
        man_cook: "👨‍🍳",
        man_dancing: "🕺",
        man_facepalming: "🤦‍♂",
        man_factory_worker: "👨‍🏭",
        man_farmer: "👨‍🌾",
        man_firefighter: "👨‍🚒",
        man_health_worker: "👨‍⚕",
        man_in_tuxedo: "🤵",
        man_judge: "👨‍⚖",
        man_juggling: "🤹‍♂",
        man_mechanic: "👨‍🔧",
        man_office_worker: "👨‍💼",
        man_pilot: "👨‍✈",
        man_playing_handball: "🤾‍♂",
        man_playing_water_polo: "🤽‍♂",
        man_scientist: "👨‍🔬",
        man_shrugging: "🤷‍♂",
        man_singer: "👨‍🎤",
        man_student: "👨‍🎓",
        man_teacher: "👨‍🏫",
        man_technologist: "👨‍💻",
        man_with_gua_pi_mao: "👲",
        man_with_turban: "👳",
        mandarin: "🍊",
        martial_arts_uniform: "🥋",
        mask: "😷",
        massage: "💆",
        massage_man: "💆‍♂",
        massage_woman: "💆",
        meat_on_bone: "🍖",
        medal_military: "🎖",
        medal_sports: "🏅",
        mega: "📣",
        melon: "🍈",
        memo: "📝",
        men_wrestling: "🤼‍♂",
        menorah: "🕎",
        mens: "🚹",
        metal: "🤘",
        metro: "🚇",
        microphone: "🎤",
        microscope: "🔬",
        middle_finger: "🖕",
        milk_glass: "🥛",
        milky_way: "🌌",
        minibus: "🚐",
        minidisc: "💽",
        mobile_phone_off: "📴",
        money_mouth_face: "🤑",
        money_with_wings: "💸",
        moneybag: "💰",
        monorail: "🚝",
        moon: "🌔",
        mortar_board: "🎓",
        mosque: "🕌",
        mountain_bicyclist: "🚵",
        mountain_biking_man: "🚵",
        mountain_biking_woman: "🚵‍♀",
        mountain_cableway: "🚠",
        mountain_railway: "🚞",
        mountain_snow: "🏔",
        mouse: "🐭",
        mouse2: "🐁",
        movie_camera: "🎥",
        moyai: "🗿",
        mrs_claus: "🤶",
        muscle: "💪",
        mushroom: "🍄",
        musical_keyboard: "🎹",
        nerd_face: "🤓",
        neutral_face: "😐",
        new: "🆕",
        new_moon: "🌑",
        new_moon_with_face: "🌚",
        newspaper: "📰",
        next_track_button: "⏭",
        ng: "🆖",
        ng_man: "🙅‍♂",
        ng_woman: "🙅",
        night_with_stars: "🌃",
        nine: "9️⃣",
        no_bell: "🔕",
        no_bicycles: "🚳",
        no_entry: "⛔️",
        no_entry_sign: "🚫",
        no_good: "🙅",
        no_good_man: "🙅‍♂",
        no_good_woman: "🙅",
        no_mobile_phones: "📵",
        no_mouth: "😶",
        no_pedestrians: "🚷",
        no_smoking: "🚭",
        "non-potable_water": "🚱",
        nose: "👃",
        notebook: "📓",
        notebook_with_decorative_cover: "📔",
        notes: "🎶",
        nut_and_bolt: "🔩",
        o: "⭕️",
        o2: "🅾️",
        ocean: "🌊",
        octopus: "🐙",
        oden: "🍢",
        office: "🏢",
        oil_drum: "🛢",
        ok: "🆗",
        ok_hand: "👌",
        ok_man: "🙆‍♂",
        ok_woman: "🙆",
        old_key: "🗝",
        older_man: "👴",
        older_woman: "👵",
        oncoming_automobile: "🚘",
        oncoming_bus: "🚍",
        oncoming_police_car: "🚔",
        oncoming_taxi: "🚖",
        open_book: "📖",
        open_file_folder: "📂",
        open_hands: "👐",
        open_mouth: "😮",
        open_umbrella: "☂️",
        orange: "🍊",
        orange_book: "📙",
        orthodox_cross: "☦️",
        outbox_tray: "📤",
        owl: "🦉",
        ox: "🐂",
        package: "📦",
        page_facing_up: "📄",
        page_with_curl: "📃",
        pager: "📟",
        parasol_on_ground: "⛱",
        peace_symbol: "☮️",
        peach: "🍑",
        peanuts: "🥜",
        pear: "🍐",
        pen: "🖊",
        pencil: "📝",
        pensive: "😔",
        performing_arts: "🎭",
        persevere: "😣",
        person_fencing: "🤺",
        person_frowning: "🙍",
        person_with_blond_hair: "👱",
        person_with_pouting_face: "🙎",
        phone: "☎️",
        pick: "⛏",
        pig: "🐷",
        pig2: "🐖",
        pig_nose: "🐽",
        pill: "💊",
        pineapple: "🍍",
        ping_pong: "🏓",
        pisces: "♓️",
        pizza: "🍕",
        place_of_worship: "🛐",
        play_or_pause_button: "⏯",
        point_down: "👇",
        point_left: "👈",
        point_right: "👉",
        point_up: "☝️",
        point_up_2: "👆",
        police_car: "🚓",
        policeman: "👮",
        policewoman: "👮‍♀",
        poodle: "🐩",
        popcorn: "🍿",
        post_office: "🏣",
        potato: "🥔",
        pouch: "👝",
        pout: "😡",
        racing_car: "🏎",
        radio: "📻",
        radio_button: "🔘",
        radioactive: "☢️",
        rage: "😡",
        railway_car: "🚃",
        railway_track: "🛤",
        rainbow: "🌈",
        rainbow_flag: "🏳️‍🌈",
        raised_back_of_hand: "🤚",
        raised_hand: "✋",
        raised_hand_with_fingers_splayed: "🖐",
        raised_hands: "🙌",
        raising_hand: "🙋",
        raising_hand_man: "🙋‍♂",
        raising_hand_woman: "🙋",
        ram: "🐏",
        ramen: "🍜",
        rat: "🐀",
        restroom: "🚻",
        reunion: "🇷🇪",
        revolving_hearts: "💞",
        rewind: "⏪",
        rhinoceros: "🦏",
        ribbon: "🎀",
        rice: "🍚",
        rice_ball: "🍙",
        rice_cracker: "🍘",
        rice_scene: "🎑",
        right_anger_bubble: "🗯",
        ring: "💍",
        robot: "🤖",
        rocket: "🚀",
        rofl: "🤣",
        roll_eyes: "🙄",
        roller_coaster: "🎢",
        rooster: "🐓",
        rose: "🌹",
        rosette: "🏵",
        rotating_light: "🚨",
        round_pushpin: "📍",
        rowboat: "🚣",
        rowing_man: "🚣",
        rowing_woman: "🚣‍♀",
        rugby_football: "🏉",
        runner: "🏃",
        running: "🏃",
        running_man: "🏃",
        running_shirt_with_sash: "🎽",
        running_woman: "🏃‍♀",
        santa: "🎅",
        sassy_man: "💁‍♂",
        sassy_woman: "💁",
        satellite: "📡",
        satisfied: "😆",
        saudi_arabia: "🇸🇦",
        saxophone: "🎷",
        school: "🏫",
        school_satchel: "🎒",
        scissors: "✂️",
        scorpion: "🦂",
        scorpius: "♏️",
        scream: "😱",
        scream_cat: "🙀",
        skull: "💀",
        skull_and_crossbones: "☠️",
        sleeping: "😴",
        sleeping_bed: "🛌",
        sleepy: "😪",
        slightly_frowning_face: "🙁",
        slightly_smiling_face: "🙂",
        smile: "😄",
        smile_cat: "😸",
        smiley: "😃",
        smiley_cat: "😺",
        smiling_imp: "😈",
        smirk: "😏",
        smirk_cat: "😼",
        smoking: "🚬",
        snail: "🐌",
        snake: "🐍",
        sneezing_face: "🤧",
        snowboarder: "🏂",
        snowflake: "❄️",
        sob: "😭",
        soccer: "⚽️",
        soon: "🔜",
        sos: "🆘",
        sound: "🔉",
        space_invader: "👾",
        spades: "♠️",
        spaghetti: "🍝",
        sparkle: "❇️",
        sparkler: "🎇",
        sparkles: "✨",
        squid: "🦑",
        stadium: "🏟",
        star: "⭐️",
        star2: "🌟",
        stop_sign: "🛑",
        stopwatch: "⏱",
        straight_ruler: "📏",
        strawberry: "🍓",
        stuck_out_tongue: "😛",
        stuck_out_tongue_closed_eyes: "😝",
        stuck_out_tongue_winking_eye: "😜",
        stuffed_flatbread: "🥙",
        sun_with_face: "🌞",
        sunflower: "🌻",
        sunglasses: "😎",
        sunny: "☀️",
        sunrise: "🌅",
        sunrise_over_mountains: "🌄",
        sushi: "🍣",
        suspension_railway: "🚟",
        sweat: "😓",
        sweat_drops: "💦",
        sweat_smile: "😅",
        sweet_potato: "🍠",
        swimmer: "🏊",
        swimming_man: "🏊",
        swimming_woman: "🏊‍♀",
        thinking: "🤔",
        thought_balloon: "💭",
        three: "3️⃣",
        thumbsdown: "👎",
        thumbsup: "👍",
        ticket: "🎫",
        tickets: "🎟",
        tiger: "🐯",
        tiger2: "🐅",
        timer_clock: "⏲",
        tipping_hand_man: "💁‍♂",
        tipping_hand_woman: "💁",
        tired_face: "😫",
        toilet: "🚽",
        tokyo_tower: "🗼",
        tomato: "🍅",
        tongue: "👅",
        top: "🔝",
        tophat: "🎩",
        tornado: "🌪",
        tractor: "🚜",
        traffic_light: "🚥",
        train: "🚋",
        train2: "🚆",
        tram: "🚊",
        triangular_flag_on_post: "🚩",
        triangular_ruler: "📐",
        trident: "🔱",
        triumph: "😤",
        trolleybus: "🚎",
        trophy: "🏆",
        tropical_drink: "🍹",
        tropical_fish: "🐠",
        truck: "🚚",
        trumpet: "🎺",
        tshirt: "👕",
        tulip: "🌷",
        tumbler_glass: "🥃",
        two_hearts: "💕",
        two_men_holding_hands: "👬",
        two_women_holding_hands: "👭",
        u5272: "🈹",
        u5408: "🈴",
        u55b6: "🈺",
        u6307: "🈯️",
        u6708: "🈷️",
        u6709: "🈶",
        u6e80: "🈵",
        u7121: "🈚️",
        u7533: "🈸",
        u7981: "🈲",
        u7a7a: "🈳",
        umbrella: "☔️",
        unamused: "😒",
        underage: "🔞",
        unicorn: "🦄",
        unlock: "🔓",
        up: "🆙",
        upside_down_face: "🙃",
        waning_crescent_moon: "🌘",
        waning_gibbous_moon: "🌖",
        warning: "⚠️",
        watch: "⌚️",
        water_buffalo: "🐃",
        watermelon: "🍉",
        wave: "👋",
        wavy_dash: "〰️",
        waxing_crescent_moon: "🌒",
        waxing_gibbous_moon: "🌔",
        wc: "🚾",
        weary: "😩",
        wedding: "💒",
        weight_lifting_man: "🏋",
        weight_lifting_woman: "🏋️‍♀️",
        whale: "🐳",
        whale2: "🐋",
        wheel_of_dharma: "☸️",
        wheelchair: "♿️",
        white_check_mark: "✅",
        white_circle: "⚪️",
        white_flag: "🏳️",
        white_flower: "💮",
        white_large_square: "⬜️",
        white_medium_small_square: "◽️",
        white_square_button: "🔳",
        wilted_flower: "🥀",
        wind_chime: "🎐",
        wine_glass: "🍷",
        wink: "😉",
        wolf: "🐺",
        woman: "👩",
        woman_artist: "👩‍🎨",
        woman_astronaut: "👩‍🚀",
        woman_cartwheeling: "🤸‍♀",
        woman_cook: "👩‍🍳",
        woman_facepalming: "🤦‍♀",
        woman_factory_worker: "👩‍🏭",
        woman_farmer: "👩‍🌾",
        woman_firefighter: "👩‍🚒",
        woman_health_worker: "👩‍⚕",
        woman_judge: "👩‍⚖",
        woman_juggling: "🤹‍♀",
        woman_mechanic: "👩‍🔧",
        woman_office_worker: "👩‍💼",
        woman_pilot: "👩‍✈",
        woman_playing_handball: "🤾‍♀",
        woman_playing_water_polo: "🤽‍♀",
        woman_scientist: "👩‍🔬",
        woman_shrugging: "🤷‍♀",
        woman_singer: "👩‍🎤",
        woman_student: "👩‍🎓",
        woman_teacher: "👩‍🏫",
        woman_technologist: "👩‍💻",
        woman_with_turban: "👳‍♀",
        worried: "😟",
        wrench: "🔧",
        writing_hand: "✍️",
        x: "❌",
        yellow_heart: "💛",
        yen: "💴",
        yin_yang: "☯️",
        yum: "😋",
        zap: "⚡️",
        zero: "0️⃣",
        zipper_mouth_face: "🤐",
        zzz: "💤"
      }
    },
    upload: {
      accept: "image/*,.mp3,.mp4, .wav",
      // url:process.env.VITE_GLOB_UPLOAD_URL+'/oss/access'
      // url: import.meta.env.VITE_GLOB_OSS_URL,
      // linkToImgUrl: import.meta.env.VITE_GLOB_OSS_URL,
      // // linkToImgCallback(responseText: string) {
      // //   console.log('responseText', responseText);
      // // },
      // // linkToImgFormat(responseText: string): string {
      // //   return responseText;
      // // },
      // success(editor: HTMLPreElement, msg: string) {
      //   console.log('editor:', editor);
      //   console.log('msg:', msg);
      // },
      // error(msg: string) {
      //   console.log('merrorsg:', msg);
      // },
      // withCredentials: false,
      // filename(name: string): string {
      //   name = name
      //     .replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '')
      //     .replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '')
      //     .replace('/\\s/g', '');
      //   console.log('name:', name);
      //   return name;
      // },
      // file(files: File[]) {
      //   return new Promise((resolve, reject) => {
      //     //   reject(111)
      //     // console.log('file-files:', files);
      //     beforeUpload()
      //       .then(() => {
      //         if (insEditor.vditor.options.upload) {
      //           insEditor.vditor.options.upload.extraData = uploadForm;
      //         }
      //         console.log('editor:', insEditor.vditor);
      //         resolve(files);
      //       })
      //       .catch((error) => {
      //         reject(error);
      //       });
      //   });
      // },
      // format(files: File[], responseText: string): string {
      //   console.log('format-files:', files);
      //   console.log('responseText:', responseText);
      //   return responseText;
      // },
      // multiple: false,
      // extraData: uploadForm,
      handler(files: File[]): string | null | Promise<any> {
        return new Promise((resolve, reject) => {
          vditor.value.disabled();
          // insEditor.vditor.upload?.isUploading=true;
          let formData = new FormData();
          // files.forEach((e: File) => {
          //   console.log('自定义上传', e);
          // });
          beforeUpload()
            .then((form: any) => {
              for (let key in form) {
                formData.append(key, form[key]);
              }
              formData.append("file", files[0]);
              console.log("insEditor:", vditor.value);
              // console.log('isupload:', vditor.value.isUploading());
              // console.log('getCursorPosition:', vditor.value.getCursorPosition());

              // resolve('');
              // return;
              upload(formData)
                .then((data: any) => {
                  let arr: any = [];
                  files.forEach((f: File) => {
                    let newUrl =
                      uploadForm.host +
                      "/" +
                      uploadForm.key.replace("${filename}", f.name);
                    arr.push(newUrl);
                  });
                  console.log("上传成功。", data);
                  console.log("链接", arr);
                  vditor.value.disabled();
                  for (let i = 0; i < arr.length; i++) {
                    let file = files[i];
                    let str = "";
                    // console.log('文件格式：', file.name);
                    // console.log('文件：', file);
                    if (file.name.indexOf(".wav") > 0) {
                      str = `<audio controls="controls" src="${arr[i]}"></audio>`;
                    } else if (file.name.indexOf(".mp4") > 0) {
                      str = `<video src="${arr[i]}"></video>`;
                    } else {
                      str = `![${file.name}](${arr[i]})`;
                    }
                    // const selection = window.getSelection();
                    // console.log('光标：', selection);
                    // if (selection) {
                    //   selection.removeAllRanges();
                    //   selection.getRangeAt()
                    //   selection.setPosition(selection);
                    // }
                    console.log("插入：", str);
                    vditor.value.insertValue(str);
                  }

                  if (
                    vditor.value.vditor.options.upload &&
                    vditor.value.vditor.options.upload.format &&
                    vditor.value.vditor.options.upload.filename &&
                    contentElement
                  ) {
                    // vditor.value.vditor.options.upload.filename(JSON.stringify(formatData));
                    // vditor.value.vditor.options.upload.format(files, JSON.stringify(formatData));
                    // vditor.value.vditor.options.upload.success(wrapEl, JSON.stringify(formatData));
                  }

                  vditor.value.enable();
                  resolve(arr);
                })
                .catch(error => {
                  vditor.value.enable();
                  reject(error);
                });
            })
            .catch(error => {
              vditor.value.enable();
              reject(error);
            });
        });
      }
    },
    outline: {
      enable: true,
      position: "left"
    },
    input: v => {
      valueRef.value = v;
      emits("update:value", v);
      emits("change", v);
    },
    after: () => {
      nextTick(() => {
        console.log("执行完初始化");
        
        vditor.value.setValue(valueRef.value);
        initedRef.value = true;
        emits("get", instance);
      });
    },
    blur: () => {
      // unref(vditorRef)?.setValue(props.value);
    },
  });
}

const instance = {
  getVditor: (): Vditor|any => vditor.value!
};

function destroy() {
  const vditorInstance = unref(vditor);
  if (!vditorInstance) return;
  try {
    vditorInstance?.destroy?.();
  } catch (error) {}
  vditor.value = null;
  initedRef.value = false;
}
onMounted(init)
onActivated(init)
onBeforeUnmount(destroy)
onDeactivated(destroy);;
onDeactivated(destroy)
</script>

<template>
  <div ref="contentRef"></div>
</template>
