import Button from '@mui/material/Button';
import Head from 'next/head';
import Image from 'next/image';
import Script from 'next/script';
import YouTube from 'react-youtube';

import Background from '../components/background';

export default function Home() {
  const opts = {
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
    },
  };

  return (
    <>
      <Background />
      <Head>
        <title>In Memory of Valerie Jane Othus</title>
        <meta property='og:type' content='website' />
        <meta property='og:title' content='Valerie Othus' />
        <meta property='og:description' content='Valerie Jane Othus Memorial – Watch the memorial service that was livestreamed on May 2nd, 2021.' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <div className='main-content'>
      <div className='blurb'>
          Valerie Jane Othus Memorial
          <div className='description'>
            Watch the memorial service that was livestreamed on May 2nd, 2021.
          </div>
        </div>
        <YouTube videoId='gbJx5NtQj6g' opts={opts} />
        <Button
          href='https://obituaries.neptunesociety.com/obituaries/tacoma-wa/valerie-othus-10138907'
          variant='contained'
          target='_blank'
          rel='noreferrer'
        >
          Read and share memories on Neptune Society
        </Button>
      </div>
    </>
  );
}
