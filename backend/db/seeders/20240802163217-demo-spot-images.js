"use strict";
const { SpotImage } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const imgs = [
	{ spotId: 1, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpbs.twimg.com%2Fmedia%2FFuzb2ijWIAIB3mJ%3Fformat%3Djpg%26name%3Dlarge&f=1&nofb=1&ipt=cfb356c8ae01c2c1a3ba4d4f54efe171740f1adc59d3f9d84e75ae1530dd2beb&ipo=images", preview: true },
	// { spotId: 1, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Falexbobes.com%2Fwp-content%2Fuploads%2F2024%2F01%2FThe-frontiers-of-Quantum-Computing-in-AI.jpeg&f=1&nofb=1&ipt=7f55669299412582eacaa4b7be125a9494e1698899d1762a085bd1b1680fc22b&ipo=images", preview: false },
	// { spotId: 1, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.UkY-RtoGY1DtggmIg5qxrAHaE7%26pid%3DApi&f=1&ipt=e7c5474555e01cc4a4b58072552dd45d29904de7b852e64875d2065473ab592e&ipo=images", preview: false },
	// { spotId: 1, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fblog.equinix.com%2Fwp-content%2Fuploads%2F2023%2F03%2Fquantum-computer-from-Oxford-Quantum-Circuits.jpg&f=1&nofb=1&ipt=0032ff7e490e852012682f16179037b467a9d2f1daf57ec6aed46ede18144ca6&ipo=images", preview: false },
	// { spotId: 1, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.intel.com%2Fcontent%2Fdam%2Fwww%2Fpublic%2Fus%2Fen%2Fnewsroom%2Fposts%2Fnewroom-quantum-hardware.jpg&f=1&nofb=1&ipt=f9961ecae9470ca8d674e1a00617841bb779abfd8e6bb0dfe63ced08d8911e94&ipo=images", preview: false },

	{ spotId: 2, url: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.lwa-architects.com%2Fwp-content%2Fuploads%2F2015%2F04%2FMediaLab_Ext-dusk-1700x1244.jpg&f=1&nofb=1&ipt=39ece33f2f53c6acd96b53046c14499ddea58d2139cf455ab0b6eef610fc35cc&ipo=images", preview: true },
	// { spotId: 2, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.bu.edu%2Fcpo%2Ffiles%2F2017%2F06%2FWilson-edit-3-2-1024x666.jpg&f=1&nofb=1&ipt=a392b6fce3dff91df715a3108a9f8d2939144c24eb19f7f98ca9d882e853a675&ipo=images", preview: false },
	// { spotId: 2, url: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Facdn.architizer.com%2Fmediadata%2Fprojects%2F442010%2F1270d5ca.gif&f=1&nofb=1&ipt=5c0e18d61e3274c5fdff5f5bdb76c08e1d1c1938a2923ba1f0628a10cba9f3c0&ipo=images", preview: false },
	// { spotId: 2, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.vox-cdn.com%2Fthumbor%2FwL3mRvVTk9mTDNcRPvGPrax_l_E%3D%2F0x0%3A2560x1707%2F1200x0%2Ffilters%3Afocal(0x0%3A2560x1707)%3Ano_upscale()%2Fcdn.vox-cdn.com%2Fuploads%2Fchorus_asset%2Ffile%2F6455499%2Frobots-cythiaa-mit-boston-series-2015.0.jpg&f=1&nofb=1&ipt=981dcda7d8867f4507b70b8948076411d59b02f7dfef44c26e178550dab2bb2e&ipo=images", preview: false },
	// { spotId: 2, url: "https://www.bu.edu/cpo/files/2017/06/Wilson-edit-1-1024x666.jpg", preview: false },

	{ spotId: 3, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.the-scientist.com%2Fassets%2FarticleNo%2F67546%2FaImg%2F37848%2Fbiogen-thumb-m.png&f=1&nofb=1&ipt=0cd1debe701f0027be827f0ada8c5d71a8ab0313728f6ed6eee5e78c1b154312&ipo=images", preview: true },
	// { spotId: 3, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.dpr.com%2Fcontent%2Fuploads%2FBiogen-B8-4-5-23.jpg%3Fauto%3Dcompress%252Cformat%26crop%3Dfocalpoint%26fit%3Dcrop%26fp-x%3D0.5%26fp-y%3D0.5%26h%3D2160%26q%3D80%26w%3D2880%26s%3Dcfc6507e2b4ff04fa188ad4f05d87fb9&f=1&nofb=1&ipt=b0b39a9d7ca64a45fab9dd7dac539a22e8b2132fd1688b3130f863faffa1141a&ipo=images", preview: false },
	// { spotId: 3, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.obrienatkins.com%2Fwp-content%2Fuploads%2F2017%2F02%2FBiogen-6406-25.jpg&f=1&nofb=1&ipt=898d094ec52a5404df78fbbb6604f1728742c6033c89feea1e80b3251b346a5d&ipo=images", preview: false },
	// { spotId: 3, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.fo_mBixLxPjPjSz9ZfJ8IwHaFj%26pid%3DApi&f=1&ipt=c5f956ecd2376db0b9f5182f9c5418acc420cb6089c90682c24175adb82e8e63&ipo=images", preview: false },
	// { spotId: 3, url: "https://media.bizj.us/view/img/197661/biogen-lab*1200xx1065-600-0-763.jpg", preview: false },

	{ spotId: 4, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fd2tji0hp2b0xan.cloudfront.net%2Fwebsite-images%2Flab%2FOutsideBuilding.jpeg&f=1&nofb=1&ipt=a6bf71ed0028f3cebae737db2d716b3e574861a637ebce27024ec2a97cdc1fbe&ipo=images", preview: true },
	// { spotId: 4, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fd2tji0hp2b0xan.cloudfront.net%2Fwebsite-images%2Flab%2FMissionControl.jpeg&f=1&nofb=1&ipt=61a4e17a211f380e717d9233df5a9f4f235d27a344747536b03e5b4c1e598f58&ipo=images", preview: false },
	// { spotId: 4, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fnaturalsciences.org%2Fimages%2Fresearch%2Fastronomy-astrophysics%2FastroLab01.jpg&f=1&nofb=1&ipt=f0412d30118be5913807155e40cd1360c8bef4ebe2289cc89767156e60e194a7&ipo=images", preview: false },
	// { spotId: 4, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fastro.berkeley.edu%2Fwp-content%2Fuploads%2F2019%2F06%2F24%2Fundergrad-lab-1803x1200.jpg&f=1&nofb=1&ipt=e54789da64cb70dee65ac8f37f5c2db7c4ffb54acab2661158425af38a43d5bd&ipo=images", preview: false },
	// { spotId: 4, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.esa.int%2Fvar%2Fesa%2Fstorage%2Fimages%2Fesa_multimedia%2Fvideos%2F2007%2F01%2Fastrolab_experiments_equipments_-_hd%2F11143315-4-eng-GB%2FAstrolab_Experiments_Equipments_-_HD_card_medium.png&f=1&nofb=1&ipt=259b59e6379024dc5cf7cc016ec3e5f1261c19d595f0f2e4098acbb49346c5a2&ipo=images", preview: false },

	{ spotId: 5, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.vrventure.nl%2Fwp%2Fwp-content%2Fuploads%2F2018%2F01%2Fhigh-tech-campus-eindhoven-40.jpg&f=1&nofb=1&ipt=d74b647484035122ea9127c8b05c24e8c634adf94f08c41468c66f55a827dd47&ipo=images", preview: true },
	// { spotId: 5, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmhealthspot.com%2Fwp-content%2Fuploads%2Frothenberg-river1.jpg&f=1&nofb=1&ipt=ccf0f0494bf4573071b654116f189b424c4a13cb1f9ea9320adfbfb5bc369614&ipo=images", preview: false },
	// { spotId: 5, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.fdMBobMFez_ACB5JSksUdgHaE7%26pid%3DApi&f=1&ipt=7289a4f4961a6c0240bd9bbbe6babd0aa0c7da33fd0edf6347346b28bd5211a1&ipo=images", preview: false },
	// // { spotId: 5, url: "https://i.pinimg.com/originals/9f/15/f6/9f15f62a4c50274017dc7a933873a451.jpg", preview: false },

	{ spotId: 6, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.nightcafe.studio%2Fjobs%2FtW5PlmGHnuExqe5qS089%2FtW5PlmGHnuExqe5qS089--1--1NWMX_2x.jpg%3Ftr%3Dw-1600%2Cc-at_max&f=1&nofb=1&ipt=c42d52ba7c0b1e0150aa47360f65b9f68da18b3a658e69c218386c43fe8cb8b5&ipo=images", preview: true },
	// { spotId: 6, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.0gF-iZGjZOZoT0r4UdqYlAHaEK%26pid%3DApi&f=1&ipt=ef2f6f01f72697ab1e5499aa82a4cb84e19a6d823b3fdd9d550db418dc0bc06d&ipo=images", preview: false },
	// { spotId: 6, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fofficesnapshots.com%2Fwp-content%2Fuploads%2F2021%2F01%2Fbigger-silicon-alley-coworking-offices-beijing-2-1536x1025.jpg&f=1&nofb=1&ipt=3c8732ebd53d98196332d7fe7126b72611797d2304b786f82af77b01d23112f8&ipo=images", preview: false },
	// { spotId: 6, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.istockphoto.com%2Fid%2F1151711697%2Fphoto%2Falley-with-jumble-of-power-lines-and-fire-escapes.jpg%3Fs%3D612x612%26w%3D0%26k%3D20%26c%3D5mzmDx7C8rCvM6ECnoePLa8Wgto7bCTMA_hbRefpcJ0%3D&f=1&nofb=1&ipt=90b54276366da7d8d42b8e022845d3c01173eaa434c2934fbe4af8f339e9402b&ipo=images", preview: false },
	// { spotId: 6, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fs3.amazonaws.com%2Fmedia.interiordesign.net%2Farchitecture_plus_information_ai_squarespace_hq_new_york_atrium_overview.jpg&f=1&nofb=1&ipt=4d1f1dec35a87a0f4f8986a14c1941d5c01e3bd002930231f91d47f0dbaf3985&ipo=images", preview: false },

	{ spotId: 7, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.nexushub.com.au%2Fwp-content%2Fuploads%2F2016%2F07%2Fnexus_hub.jpg&f=1&nofb=1&ipt=e56234f850fd216b4ac5fdd512297971c7009977f9338d29635d284258bd2bfe&ipo=images", preview: true },
	// { spotId: 7, url: "https://nexushub.b-cdn.net/wp-content/uploads/2022/06/EDIT_43-1536x1024.jpg", preview: false },
	// { spotId: 7, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia-exp1.licdn.com%2Fdms%2Fimage%2FC561BAQFnCuTcsMS2sw%2Fcompany-background_10000%2F0%2F1536804830660%3Fe%3D2147483647%26v%3Dbeta%26t%3DaMmuBrENam2PxskEZwGy8uAlmomnK85SZLNH-lQcsFI&f=1&nofb=1&ipt=cca2201fdb3f4114876696e318994614142d7ebc57b5d1302d82d32c77a694d4&ipo=images", preview: false },
	// { spotId: 7, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.nexushub.com.au%2Fwp-content%2Fuploads%2F2022%2F06%2FEDIT_37-scaled.jpg&f=1&nofb=1&ipt=201e51915daba41847ffd0bd7d85bb95a1b88ecf3e627f9e8a0fa515c58f8166&ipo=images", preview: false },
	// { spotId: 7, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.nexushub.com.au%2Fwp-content%2Fuploads%2F2022%2F07%2Faerial_2.jpg&f=1&nofb=1&ipt=4a80a2e433464c4fa3f12f1f24de257edb015c3a36b3648cbff7d978459ed5a7&ipo=images", preview: false },

	{ spotId: 8, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fnews.mit.edu%2Fsites%2Fdefault%2Ffiles%2Fimages%2F201906%2FMIT-Greentown-Labs-01.jpg&f=1&nofb=1&ipt=83afb9509353b21a8df8a967d87944ba209e0b757b75e4ae3501e2e7823d8a89&ipo=images", preview: true },
	// { spotId: 8, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.i782Tzdb_ed4-qpsPibxvwAAAA%26pid%3DApi&f=1&ipt=1dcff46b49b5f7e4814158cb9233f3db825ddbfee8a42b8c800233871ed6778b&ipo=images", preview: false },
	// { spotId: 8, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.x4WNQ_oqy5WdlCK5UgUxawEgDY%26pid%3DApi&f=1&ipt=d8fc8655ea7fd510296ef8cd39b609dcfb42e49105b8781a725cfa32f9c37525&ipo=images", preview: false },
	// { spotId: 8, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fgreentownlabs.com%2Fwp-content%2Fuploads%2F2022%2F04%2FExterior-6-1024x576.png&f=1&nofb=1&ipt=cbb55dc0f5ab9554db96089bb8a8ea6d127cbe5eacac743534df53f4a33dc923&ipo=images", preview: false },
	// { spotId: 8, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fgreentownlabs.com%2Fwp-content%2Fuploads%2FSoftware-and-Space-Resources-768x443.png&f=1&nofb=1&ipt=4810f7d59fb22be160f4c8461b111d99516aeea82e886912597468a0471252b0&ipo=images", preview: false },

	{ spotId: 9, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.cnews.fr%2Fsites%2Fdefault%2Ffiles%2Fcampus_cyber_-_tout_savoir_sur_ce_pole_dedie_a_la_lutte_contre_les_cybermenaces_61fd44a73d492.jpg&f=1&nofb=1&ipt=a9974640805e12728e5ba54d1318c0d17b02eb68938ce022a089f15493e67c93&ipo=images", preview: true },
	// { spotId: 9, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages3.alphacoders.com%2F563%2Fthumb-1920-563667.jpg&f=1&nofb=1&ipt=4e99a8daa57edf1b6ccadfd9cc0f1e14136d9b668d46793e57179f9dcb5a4257&ipo=images", preview: false },
	// { spotId: 9, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.iosb.fraunhofer.de%2Fen%2Fprojects-and-products%2Fcybersecurity-learning-lab%2Fjcr%3Acontent%2FcontentPar%2Fsectioncomponent%2FsectionParsys%2Ftextwithinlinedimage%2FimageComponent2%2Fimage.img.jpg%2F1611244280465%2FIT-SecurityLab-08062015-01-web.jpg&f=1&nofb=1&ipt=a8b11ada3f211e965b6444271a9275019fde07f800634fc185bcae428a913ba4&ipo=images", preview: false },
	// { spotId: 9, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.nottingham.ac.uk%2Fcomputerscience%2Fimages-multimedia%2Fcybsec%2Fimg-1464.jpg&f=1&nofb=1&ipt=79b30f1ff0400bc7ffd1e5c63d35353b01fb3d12fe5978a4b9ccf96f895398da&ipo=images", preview: false },
	// { spotId: 9, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.AqTVYrAUzLOPt8arRajsiAHaFR%26pid%3DApi&f=1&ipt=70932031ac225f2f067351e407a93b74238002cbb46050627b8a5b92ffa34cb9&ipo=images", preview: false },

	{ spotId: 10, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.o-2qB6Nj6vZPC_zwXfCQswAAAA%26pid%3DApi&f=1&ipt=6ba077e3bdc3add71477c7af57006ec1c9480290238ee9f705f4251f770262dc&ipo=images", preview: true },
	// { spotId: 10, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.5PY17e8HxgGgjrBjHLeWOgHaEK%26pid%3DApi&f=1&ipt=05dcda653fca21e8eed1afa4d61bbbd20e83cf32063957b4c869a83086aa75f0&ipo=images", preview: false },
	// { spotId: 10, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.QXuRHX5syoi5o_uXG1Vq5wHaE8%26pid%3DApi&f=1&ipt=4a11da8e080df635430e61db23993882d93cfafb2013ea2b4daa69bf4f828de9&ipo=images", preview: false },
	// { spotId: 10, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.XHjdBWnuHy0Q8lXpyqbuHAHaEK%26pid%3DApi&f=1&ipt=4189894c628e2642fed6bc47d8c487c20adb7add1bef516042678e356b2c4901&ipo=images", preview: false },
	// { spotId: 10, url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.ki_C1xBlnzj5IdgSu0Id9wHaD4%26pid%3DApi&f=1&ipt=2203ddde135322e5de125e04b2cf6c233013e262101648b9118bd9144150cf3e&ipo=images", preview: false },
];


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await SpotImage.bulkCreate(imgs, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "SpotImages";
    await queryInterface.bulkDelete(options, imgs, {});
  },
};
