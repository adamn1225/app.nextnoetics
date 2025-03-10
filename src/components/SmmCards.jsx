import React, { useState, useEffect } from 'react';
import { Editor, Frame, Element } from "@craftjs/core";
import { CardTools } from './cms/CardTools';
import { Layers } from '@craftjs/layers';
import { FbContainerSettings, FbContainer } from './cms/cards/FbContainer';
import { SettingsPanel } from './cms/SettingsPanel';
import { Container } from './cms/user/Container';
import { Button, ButtonSettings } from './cms/user/Button';
import { Post, PostTop, PostSettings } from './cms/cards/Post';
import { Header } from './cms/user/Header';
import { TextArea } from './cms/user/TextArea';
import { BackgroundImage } from './cms/user/BackgroundImage';
import { ImageUpload, ImageUploadSettings } from './cms/user/ImageUpload';
import { OneColumnContainer, OneColumnContainerSettings } from './cms/user/gridlayouts/OneColumnContainer';
import { TwoColumnContainerSettings, TwoColumnContainer } from './cms/user/gridlayouts/TwoColumnContainer';
import { ThreeColumnContainer, ThreeColumnContainerSettings } from './cms/user/gridlayouts/ThreeColumnContainer';
import StoredTemplates from './StoredTemplates';
import CustomModal from './CustomModal';
import { Topbar } from './cms/Topbar';
import { IgContainer, IgContainerSettings } from './cms/cards/IgContainer';
import UrlConverter from './UrlConverter';
import SubscriptionModal from './cms/SubscriptionModal';
import Loader from './Loader';
import { supabase } from '../lib/supabaseClient';
import { Card, CardSettings } from './cms/user/Card';
import EmojiComponent  from './cms/user/EmojiComponent';

const SmmCards = ({ session }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState('Facebook');
  const [convertedData, setConvertedData] = useState(null);
  const [subscriptionModalIsOpen, setSubscriptionModalIsOpen] = useState(true);
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
      }
      setIsLoading(false);
    };

    checkUserPlan();
  }, [session]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className='w-full h-screen bg-white dark:bg-gray-800 overflow-x-hidden'>
      <Editor resolver={{ Post, PostSettings, Button, Header, ImageUploadSettings, ImageUpload, Container, PostTop, TwoColumnContainer, ThreeColumnContainerSettings, TextArea, ThreeColumnContainer, TwoColumnContainerSettings, OneColumnContainer, OneColumnContainerSettings, FbContainerSettings, FbContainer, ButtonSettings, IgContainer, IgContainerSettings, BackgroundImage, Card, CardSettings, EmojiComponent }} >
      <div className="grid grid-cols-[5fr_1fr] h-full w-full lg:mb-0">
             
        

             
                <>
                {selectedCard === 'Facebook' && (
                 <div className='flex flex-col justify-normal items-center h-full w-full'>
                    <h1 className='text-blue-500 text-center py-5 text-2xl font-bold'>Facebook Image Card Preview</h1>
                    <Frame key={`facebook-${JSON.stringify(convertedData)}`}>
                      <Element is={Post} containerType="facebook" h1={convertedData?.h1} h2={convertedData?.h2} img={convertedData?.img} canvas>
                        <Element is={Card} containerType="facebook" h1={convertedData?.h1} h2={convertedData?.h2} img={convertedData?.img} />
                      </Element>
                    </Frame>
                  </div>
                )}
                {selectedCard === 'Instagram' && (
                <div className='flex flex-col justify-normal items-center h-full w-full'>
                      <h1 className='text-rose-700 text-center py-5 text-xl font-bold'>Instagram Image Card Preview </h1>
                    <Frame key={`instagram-${JSON.stringify(convertedData)}`}>
                      <div className='flex justify-center items-start h-full w-full'>
                        <div style={{ transform: 'scale(0.5)', transformOrigin: 'top' }}>
                          <Element is={IgContainer} canvas>
                            <Element is={Post} background={"#adaaaa"} containerType="instagram" h1={convertedData?.h1} h2={convertedData?.h2} img={convertedData?.img} />
                          </Element>
                        </div>
                      </div>
                    </Frame>
                </div>
                )}
              </>

        
            <div className='pt-12 fixed right-0 top-0 z-10 w-[20vw] max-w-[20vw] min-w-[20vw] bg-gray-950 h-full overflow-y-auto flex flex-col justify-start'>
              <div className='flex w-furedjustify-center items-center border-b border-gray2000'>
                <button onClick={() => setTab('components')} className={`w-full p-2 rounded-t-sm text-sm ${tab === 'components' ? 'bg-teal-500 text-white' : 'bg-teal-600 opacity-90 text-white'}`}>Components</button>
                <button onClick={() => setTab('settings')} className={`w-full p-2 rounded-t-sm text-sm ${tab === 'settings' ? 'bg-rose-500 text-white' : 'bg-rose-600 opacity-90 text-white'}`}>Settings</button>
                <button onClick={() => setTab('urlConverter')} className={`w-full p-2 rounded-t-sm text-sm ${tab === 'urlConverter' ? 'bg-blue-500 text-white' : 'bg-blue-600 opacity-90 text-white'}`}>URL Converter</button>
              </div>
           red
            <div className='h-full w-full pt-8  bg-zinc-900'>
              {tab === "components" && (
                  <div className='flex px-4 flex-col justify-center items-center gap-1'>
                    <h1 className='text-lg text-center font-semibold text-gray-50'>Select SM Card Type</h1>
                    <select className='bg-white border border-gray-300 rounded-sm p-2' value={selectedCard} onChange={(e) => handleCardChange(e.target.value)}>
                      <option value="Facebook">Facebook Card</option>
                      <option value="Instagram">Instagram Card</option>
                    </select>
                    <CardTools />
                    </div>
                )}
                  
                  {tab === "settings" && ( 
                   <div className='h-full w-full pt-8  bg-zinc-900'>
                      <SettingsPanel />
                    <span className='bg-white w-full mt-4'>
                      <Layers expanded/>
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

                </div>
                  
                                {tab === "urlConverter" && (
          <UrlConverter onConvert={handleConvert} urls={urls} setUrls={setUrls} />
              )}
            </div>
          </div>

        <CustomModal isOpen={modalIsOpen} onClose={closeModal}>
          <Topbar openSubscriptionModal={openSubscriptionModal} />
        </CustomModal>

        <SubscriptionModal isOpen={subscriptionModalIsOpen} onClose={closeSubscriptionModal} />
      </Editor>
    </div>
  );
}

export default SmmCards;