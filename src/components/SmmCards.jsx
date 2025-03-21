import React, { useState, useEffect } from 'react';
import { Editor, Frame, Element } from "@craftjs/core";
import { CardTools } from './cms/CardTools';
import { Layers } from '@craftjs/layers';
import { FbContainerSettings, FbContainer } from './cms/cards/FbContainer';
import { SettingsPanel } from './cms/SettingsPanel';
import { Container } from './cms/user/Container';
import { Button, ButtonSettings } from './cms/user/Button';
import { Post, PostSettings } from './cms/cards/Post';
import { Header, HeaderSettings } from './cms/user/Header';
import { TextArea } from './cms/user/TextArea';
import { BackgroundImage } from './cms/user/BackgroundImage';
import { ImageUpload, ImageUploadSettings } from './cms/user/ImageUpload';
import { OneColumnContainer, OneColumnContainerSettings } from './cms/user/gridlayouts/OneColumnContainer';
import { TwoColumnContainerSettings, TwoColumnContainer } from './cms/user/gridlayouts/TwoColumnContainer';
import { ThreeColumnContainer, ThreeColumnContainerSettings } from './cms/user/gridlayouts/ThreeColumnContainer';
import { IgContainer, IgContainerSettings } from './cms/cards/IgContainer';
import StoredTemplates from './StoredTemplates';
import CustomModal from './CustomModal';
import { Topbar } from './cms/Topbar';
import UrlConverter from './UrlConverter';
import SubscriptionModal from './cms/SubscriptionModal';
import Loader from './Loader';
import { supabase } from '../lib/supabaseClient';
import { Card, CardSettings } from './cms/user/Card';
import { EmojiComponent, EmojiSettings } from './cms/user/EmojiComponent';
import InitializeCardSelection from './InitializeCardSelection';
import { LinkedInContainer, LinkedInContainerSettings } from './cms/cards/LinkedInContainer';
import { TwitterContainer, TwitterContainerSettings } from './cms/cards/TwitterContainer';
import { FaLinkedin, FaTwitter } from "react-icons/fa";
import { SiFacebook, SiInstagram } from "react-icons/si";

const SmmCards = ({ session }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState('Facebook');
  const [instagramRatio] = useState('square');
  const [convertedData, setConvertedData] = useState(null);
  const [subscriptionModalIsOpen, setSubscriptionModalIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState('components');
  const [urls, setUrls] = useState(['']); // State for URLs

  const openModal = async () => {
    if (!session) {
      openSubscriptionModal();
    } else {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', session.user.id)
        .single();

      if (error || !profile || profile.plan === 'freemium') {
        openSubscriptionModal();
      } else {
        setModalIsOpen(true);
      }
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openSubscriptionModal = () => {
    setSubscriptionModalIsOpen(true);
    localStorage.setItem('subscriptionModalShown', 'true');
  };

  const closeSubscriptionModal = () => {
    setSubscriptionModalIsOpen(false);
  };

  const handleCardChange = (card) => {
    setSelectedCard(card);
  };

  const handleConvert = (data) => {
    setConvertedData(data);
  };

  useEffect(() => {
    // This effect will run whenever convertedData changes
    console.log('Converted data updated:', convertedData);
  }, [convertedData]);

  useEffect(() => {
    const checkUserPlan = async () => {
      const subscriptionModalShown = localStorage.getItem('subscriptionModalShown');
      if (session && !subscriptionModalShown) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', session.user.id)
          .single();

        if (error || !profile || profile.plan === 'freemium') {
          openSubscriptionModal();
        }
      } else if (!session) {
        openSubscriptionModal();
      }
      setIsLoading(false);
    };

    checkUserPlan();
  }, [session]);

  if (isLoading) {
    return <Loader />;
  }

  const cardIcons = {
    Facebook: <SiFacebook className="inline-block mr-2" />,
    Instagram: <SiInstagram className="inline-block mr-2" />,
    LinkedIn: <FaLinkedin className="inline-block mr-2" />,
    Twitter: <FaTwitter className="inline-block mr-2" />,
  };

  return (
    <div className='w-full h-screen bg-white dark:bg-gray-800 overflow-x-hidden'>
      <Editor resolver={{ Post, PostSettings, Button, Header, HeaderSettings, ImageUploadSettings, ImageUpload, Container, TwoColumnContainer, ThreeColumnContainerSettings, TextArea, ThreeColumnContainer, TwoColumnContainerSettings, OneColumnContainer, OneColumnContainerSettings, FbContainerSettings, FbContainer, ButtonSettings, IgContainer, IgContainerSettings, BackgroundImage, Card, CardSettings, EmojiComponent, EmojiSettings, LinkedInContainer, LinkedInContainerSettings, TwitterContainer, TwitterContainerSettings}} >
        <InitializeCardSelection />
        <div className="grid grid-cols-[1fr_4fr_1fr] h-full w-full lg:mb-0">
          <div className="h-full w-[17rem] bg-gray-800 text-white z-20">
            <h1 className='text-white text-lg font-semibold text-center py-2'>Component Settings</h1>
            <SettingsPanel />
          </div>
          <>
            {selectedCard === 'Facebook' && (
              <div className='flex flex-col justify-normal items-center'>
                <h1 className='text-blue-500 text-center py-5 text-2xl font-bold'>Facebook Image Card Preview</h1>
                <Frame key={`facebook-${JSON.stringify(convertedData)}`}>
                  <Element is={FbContainer} displayName="Canvas" containerType="facebook" h1={convertedData?.h1} h2={convertedData?.h2} img={convertedData?.img} canvas>
                    <Element is={Card} containerType="facebook" h1={convertedData?.h1} h2={convertedData?.h2} img={convertedData?.img} />
                  </Element>
                </Frame>
              </div>
            )}
            {selectedCard === 'Instagram' && (
              <div className='flex flex-col justify-normal items-center h-full w-full'>
                <h1 className='text-rose-700 text-center py-5 text-xl font-bold'>Instagram Image Card Preview </h1>
                <Frame key={`instagram-${JSON.stringify(convertedData)}`}>
                    <Element is={IgContainer} displayName="Canvas" containerType="instagram" instagramRatio={instagramRatio} h1={convertedData?.h1} h2={convertedData?.h2} img={convertedData?.img} canvas>
                        <Element is={Card} containerType="instagram" h1={convertedData?.h1} h2={convertedData?.h2} img={convertedData?.img} />
                      </Element>
                </Frame>
              </div>
            )}
            {selectedCard === 'LinkedIn' && (
              <div className='flex flex-col justify-normal items-center h-full w-full'>
                <h1 className='text-blue-500 text-center py-5 text-2xl font-bold'>LinkedIn Image Card Preview</h1>
                <Frame key={`linkedin-${JSON.stringify(convertedData)}`}>
                  <Element is={LinkedInContainer} displayName="Canvas" containerType="linkedin" h1={convertedData?.h1} h2={convertedData?.h2} img={convertedData?.img} canvas>
                    <Element is={Card} containerType="linkedin" h1={convertedData?.h1} h2={convertedData?.h2} img={convertedData?.img} />
                  </Element>
                </Frame>
              </div>
            )}
            {selectedCard === 'Twitter' && (
              <div className='flex flex-col justify-normal items-center h-full w-full'>
                <h1 className='text-blue-500 text-center py-5 text-2xl font-bold'>Twitter Image Card Preview</h1>
                <Frame key={`twitter-${JSON.stringify(convertedData)}`}>
                  <Element is={TwitterContainer} displayName="Canvas" containerType="twitter" h1={convertedData?.h1} h2={convertedData?.h2} img={convertedData?.img} canvas>
                    <Element is={Card} containerType="twitter" h1={convertedData?.h1} h2={convertedData?.h2} img={convertedData?.img} />
                  </Element>
                </Frame>
              </div>
            )}  
          </>
          <div className='pt-12 relative right-0 top-0 w-[20vw] max-w-[20vw] min-w-[20vw] bg-gray-950 h-full overflow-y-auto flex flex-col justify-start'>
            <div className='flex w-full justify-center items-center border-b border-gray-200'>
              <button onClick={() => setTab('components')} className={`w-full p-2 rounded-t-sm text-sm ${tab === 'components' ? 'btn-gradient ' : 'btn-gradient opacity-90 '}`}>Components</button>
              <button onClick={() => setTab('urlConverter')} className={`w-full p-2 rounded-t-sm text-sm ${tab === 'urlConverter' ? 'bg-green-500 text-white' : 'bg-green-600 opacity-90 text-white'}`}>URL Converter</button>
            </div>
            <div className='h-full w-full pt-8 bg-zinc-900'>
              {tab === "components" && (
                <div className='flex px-4 flex-col justify-center items-center gap-1'>
                  <h1 className='text-lg text-center font-semibold text-gray-50'>Select SM Card Type</h1>
                  <div className='flex items-center'>
                    {cardIcons[selectedCard]}
                    <select className='bg-zinc-100 border border-gray-300 rounded-xs w-full p-2' value={selectedCard} onChange={(e) => handleCardChange(e.target.value)}>
                      <option value="Facebook">Facebook Card</option>
                      <option value="Instagram">Instagram Card</option>
                      <option value="LinkedIn">LinkedIn Card</option>
                      <option value="Twitter">Twitter Card</option>
                    </select>
                  </div>
                  <CardTools />
                  <span className='bg-white w-full mt-4'>
                    <Layers expanded />
                  </span>
                  <div className='relative bottom-2 flex flex-col gap-2 mt-12 h-full w-full'>
                    <button onClick={openModal} className="text-gradient font-bold border border-1 border-primary p-2 text-center mt-4 hover:bg-primary hover:text-white ">
                      Save Template
                    </button>
                    <div className='w-full text-gray-950 p-4'>
                      <StoredTemplates session={session} />
                    </div>
                  </div>
                </div>
              )}
              {tab === "urlConverter" && (
                <UrlConverter onConvert={handleConvert} urls={urls} setUrls={setUrls} />
              )}
            </div>
          </div>
          <CustomModal isOpen={modalIsOpen} onClose={closeModal}>
            <Topbar openSubscriptionModal={openSubscriptionModal} />
          </CustomModal>
          <SubscriptionModal isOpen={subscriptionModalIsOpen} onClose={closeSubscriptionModal} />
        </div>
      </Editor>
    </div>
  );
}

export default SmmCards;