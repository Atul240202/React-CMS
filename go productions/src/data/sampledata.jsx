export const motionsPageData = [
  {
    video:
      'https://res.cloudinary.com/da3r1iagy/video/upload/v1727868648/-49bb-4417-823b-cdca67a46a38_clserw.mp4',
    logo: 'https://res.cloudinary.com/da3r1iagy/image/upload/v1727819976/e20e92c99b193be2a7c7ab6b926a18fd_brkqin.png', // Replace with the actual path to the logo
    text: 'Tata Car',
    client: 'tata',
  },
  {
    video:
      'https://res.cloudinary.com/da3r1iagy/video/upload/v1727868655/-f4de-4cd6-8720-860efd6c272b_ac1fhk.mp4',
    logo: 'https://res.cloudinary.com/da3r1iagy/image/upload/v1727819976/e20e92c99b193be2a7c7ab6b926a18fd_brkqin.png', // Replace with the actual path to the logo
    text: 'Pantaloons',
    client: 'pantaloons',
  },
  {
    video:
      'https://res.cloudinary.com/da3r1iagy/video/upload/v1727868661/-ceaf-47ec-8e60-9468da999b3f_gemyqj.mp4',
    logo: 'https://res.cloudinary.com/da3r1iagy/image/upload/v1727819976/e20e92c99b193be2a7c7ab6b926a18fd_brkqin.png', // Replace with the actual path to the logo
    text: 'Sample Text',
    client: 'pantaloons',
  },
];

export const stillPageData = [
  {
    image:
      'https://res.cloudinary.com/da3r1iagy/image/upload/v1728759713/221215-6-2308-scaled_fjy0pm.png',
    logo: 'https://res.cloudinary.com/da3r1iagy/image/upload/v1727819976/e20e92c99b193be2a7c7ab6b926a18fd_brkqin.png',
    text: 'Still Image',
    client: 'pantaloons',
    internalImages: {
      item1:
        'https://res.cloudinary.com/da3r1iagy/image/upload/v1729420380/FEST0167a-scaled_kwctnc.png',
      item2:
        'https://res.cloudinary.com/da3r1iagy/image/upload/v1729420385/FEST3046-scaled_qzddsc.png',
    },
  },
  {
    image:
      'https://res.cloudinary.com/da3r1iagy/image/upload/v1728759713/Pantaloons-18th-Oct-2022-_-1323-1-scaled_ujfzsv.png',
    logo: 'https://res.cloudinary.com/da3r1iagy/image/upload/v1727819976/e20e92c99b193be2a7c7ab6b926a18fd_brkqin.png',
    text: 'Still Image',
    client: 'pantaloons',
    internalImages: {
      item1:
        'https://res.cloudinary.com/da3r1iagy/image/upload/v1729420380/FEST0088-scaled_4_tpedft.png',
    },
  },
  {
    image:
      'https://res.cloudinary.com/da3r1iagy/image/upload/v1728759721/FEST0088-scaled_uispvw.png',
    logo: 'https://res.cloudinary.com/da3r1iagy/image/upload/v1727819976/e20e92c99b193be2a7c7ab6b926a18fd_brkqin.png',
    text: 'Still Image',
    client: 'campus',
    internalImages: {
      item1:
        'https://res.cloudinary.com/da3r1iagy/image/upload/v1729420379/FEST0125a-scaled_i9isnl.png',
    },
  },
  {
    image:
      'https://res.cloudinary.com/da3r1iagy/image/upload/v1727819659/Component_69_imvclm.png',
    logo: 'https://res.cloudinary.com/da3r1iagy/image/upload/v1727819976/e20e92c99b193be2a7c7ab6b926a18fd_brkqin.png',
    text: 'Still Image',
    client: 'flipkart',
    internalImages: {
      item1:
        'https://res.cloudinary.com/da3r1iagy/image/upload/v1729420385/FEST3046-scaled_qzddsc.png',
      item2:
        'https://res.cloudinary.com/da3r1iagy/image/upload/v1729420379/FEST0125a-scaled_i9isnl.png',
    },
  },
];

export const createClientPages = () => {
  const clients = [
    {
      image:
        'https://res.cloudinary.com/da3r1iagy/image/upload/v1729449806/Client%20logos/k9nbercqswumpied5jst.png',
      name: 'Bajaj',
      clientKey: 'bajaj',
    },
    {
      image:
        'https://res.cloudinary.com/da3r1iagy/image/upload/v1729449806/Client%20logos/ownpfuyjk69jo4x8nqmm.png',
      name: 'Rupa',
      clientKey: 'rupa',
    },
    {
      image:
        'https://res.cloudinary.com/da3r1iagy/image/upload/v1729449804/Client%20logos/azhridxvok9icslwdgu7.png',
      name: 'Campus',
      clientKey: 'campus',
    },
  ];

  return clients.map((client) => ({
    ...client,
    stills: stillPageData.filter((still) => still.client === client.clientKey),
    motions: motionsPageData.filter(
      (motion) => motion.client === client.clientKey
    ),
  }));
};

export const clientPages = createClientPages();

export const locationData = [
  {
    image:
      'https://res.cloudinary.com/da3r1iagy/image/upload/v1728323935/e2d8ba4d4cd699bcc4669c0e7ce01b32_tobuve.png',
    text: 'Location_1',
    locationDesc: 'Breathtaking mountain views',
    address: 'Gurgoan - Haryana',
    locationImages: {
      image1:
        'https://res.cloudinary.com/da3r1iagy/image/upload/v1730050904/image_79_cutvdb.png',
      image2:
        'https://res.cloudinary.com/da3r1iagy/image/upload/v1730050904/image_77_ydqkro.png',
      image3:
        'https://res.cloudinary.com/da3r1iagy/image/upload/v1730050904/image_78_f4mztf.png',
    },
  },
  {
    image:
      'https://res.cloudinary.com/da3r1iagy/image/upload/v1728323935/1ad23f85ffce6677e3e4a7975417c597_y5rffi.png',
    text: 'Location_2',
    locationDesc: 'Peaceful countryside fields',
    address: 'Gurgoan - Haryana',
    locationImages: {
      image1:
        'https://res.cloudinary.com/da3r1iagy/image/upload/v1730050904/image_79_cutvdb.png',
      image2:
        'https://res.cloudinary.com/da3r1iagy/image/upload/v1730050904/image_77_ydqkro.png',
      image3:
        'https://res.cloudinary.com/da3r1iagy/image/upload/v1730050904/image_78_f4mztf.png',
      image4:
        'https://res.cloudinary.com/da3r1iagy/image/upload/v1730050904/image_78_f4mztf.png',
    },
  },
];

export const sampleCreateClientPages = () => {
  const clients = [
    {
      image: '',
      // 'image url',
      name: '',
      clientKey: '',
      stills: {
        image: '', //image url
        clientId: 'id',
        logo: '', // fetch client image url as with key: image as logo
        text: 'Still Image',
        internalImages: {
          item1: '', //image url
          item2: '', //image url
        },
        credits: {
          photographer: 'Photographer 1',
          assistant: 'Assistant 1',
          // {dynamic fields which can be fetched}
        },
      },
      motions: {
        video: '', //video url
        logo: '', // fetch client image url as with key: image as logo
        text: 'Motion title',
        clientId: 'id',
        productTitle: 'product title',
        credits: {
          photographer: 'Photographer 1',
          assistant: 'Assistant 1',
          // {dynamic fields which can be fetched}
        },
      },
    },
  ];

  return clients.map((client) => ({
    ...client,
    stills: stillPageData.filter((still) => still.client === client.clientKey),
    motions: motionsPageData.filter(
      (motion) => motion.client === client.clientKey
    ),
  }));
};
