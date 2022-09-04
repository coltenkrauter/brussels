import Button from '@mui/material/Button';
import Head from 'next/head';
import Image from 'next/image';
import Script from 'next/script';
import YouTube from 'react-youtube';

import Background from '../components/background';

export default function Home() {
  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
    },
  };

  return (
    <>
      <Background />
      <Head>
        <title>In Memory of Valerie Othus</title>
        <meta property='og:type' content='website' />
        <meta property='og:title' content='Valerie Othus' />
        <meta property='og:description' content='Valerie Othus Memorial – Watch the memorial service that was livestreamed on May 2nd, 2021.' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <center>
        <div  style={{padding: '1em'}}>
          <YouTube videoId='gbJx5NtQj6g' opts={opts} />
          <br /><br />
          <Button
            href='https://obituaries.neptunesociety.com/obituaries/tacoma-wa/valerie-othus-10138907'
            variant='contained'
            color='secondary'
            target='_blank'
            rel='noreferrer'
          >
            Please read and share memories here
          </Button>
        </div>
      </center>
    </>
  );
}
