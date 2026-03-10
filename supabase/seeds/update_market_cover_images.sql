update public.market_series
set cover_image_url = data.cover_image_url
from (
  values
    (
      'kobenhavns-loppetorv',
      'https://impro.usercontent.one/appid/oneComWsb/domain/kbhloppetorv.dk/media/kbhloppetorv.dk/onewebmedia/her-og-nu.jpg?etag=%22df53-6050db92%22&sourceContentType=image%2Fjpeg'
    ),
    (
      'veras-market-under-buen',
      'https://verasvintage.dk/wp-content/uploads/2023/04/UnderBuen-30-04-2023-55-e1684415437533-1024x1024.jpg'
    ),
    (
      'veras-market-norrebrohallen',
      'https://verasvintage.dk/wp-content/uploads/2023/12/KQ4A1729-e1756989676193-1024x683.jpg'
    ),
    (
      'det-groenne-loppemarked',
      'https://detgroenneloppemarked.dk/wp-content/uploads/2025/03/OM-OS-IMAGES1000PX_54.jpg'
    ),
    (
      'loppemarked-i-bella',
      'https://loppemarkedibella.dk/media/ufppntlq/rs12579_381-uset-media-dsc09083.jpg?format=webp&height=1920&width=1920'
    ),
    (
      'kobenhavnstrup-loppemarked',
      'https://i0.wp.com/www.kobenhavnstrup.dk/wp-content/uploads/2023/01/Lopper-i-solskin.jpg?resize=1920%2C1440&ssl=1'
    ),
    (
      'balders-lopper',
      'https://brugbyen.kk.dk/sites/default/files/styles/event_hero_desktop/public/co-creation/event/Loppebillede%201_0.jpg?itok=OyFypFU4'
    ),
    (
      'loppemarked-paa-bryggen',
      'https://kulturhusetislandsbrygge.kk.dk/sites/default/files/2026-02/loppemarkedp%C3%A5bryggen_nyhed.png'
    ),
    (
      'loppemarked-i-remisen',
      'https://kulturogfritidoe.kk.dk/sites/default/files/styles/hero_desktop/public/2023-06/Remisen%20facade%20besk%C3%A5ret_0.png?itok=58cvznvd'
    ),
    (
      'paenere-genbrug-paa-sankt-jakobs-plads',
      'https://brugbyen.kk.dk/sites/default/files/styles/event_hero_desktop/public/2025-04/Design%20uden%20navn.jpg?itok=b1P_K2VZ'
    ),
    (
      'loppelinda-enghave-plads',
      'https://static.wixstatic.com/media/4ff90b_38a172caa43f45d985a9f7d4484e582f~mv2.jpg/v1/fill/w_980%2Ch_526%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_auto/4ff90b_38a172caa43f45d985a9f7d4484e582f~mv2.jpg'
    ),
    (
      'loppelinda-stefansgade',
      'https://static.wixstatic.com/media/4ff90b_e16371e3db764a6bb03847fa4d5317e3~mv2.jpg/v1/fill/w_980%2Ch_821%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_auto/4ff90b_e16371e3db764a6bb03847fa4d5317e3~mv2.jpg'
    )
) as data(slug, cover_image_url)
where public.market_series.slug = data.slug;
