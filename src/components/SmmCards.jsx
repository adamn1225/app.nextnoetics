"use client";
import React, { useState, useEffect } from 'react';
import { Editor, Frame, Element } from "@craftjs/core";
import { CardTools } from './cms/CardTools';
import { Layers } from '@craftjs/layers';
import { FbContainerSettings, FbContainer } from './cms/cards/FbContainer';
import { SettingsPanel } from './cms/SettingsPanel';
import { Container } from './cms/user/Container';
import { Button, ButtonSettings } from './cms/user/Button';
import { CardSettings } from './cms/user/Card';
import { Post, PostTop } from './cms/cards/Post';
import { Header } from './cms/user/Header';
import { TextArea } from './cms/user/TextArea';
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
import { supabase } from '../lib/supabaseClient';

const SmmCards = ({ session }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState('Facebook');
  const [convertedData, setConvertedData] = useState(null);
  const [subscriptionModalIsOpen, setSubscriptionModalIsOpen] = useState(false);

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
      if (session) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', session.user.id)
          .single();

        if (error || !profile || profile.plan === 'freemium') {
          openSubscriptionModal();
        }
      } else {
        openSubscriptionModal();
      }
    };

    checkUserPlan();
  }, [session]);

  return (
    <div className='w-full h-screen bg-white dark:bg-gray-800 overflow-x-hidden'>
      <Editor resolver={{ Post, Button, Header, ImageUploadSettings, ImageUpload, Container, PostTop, TwoColumnContainer, ThreeColumnContainerSettings, TextArea, ThreeColumnContainer, TwoColumnContainerSettings, OneColumnContainer, OneColumnContainerSettings, FbContainerSettings, FbContainer, ButtonSettings, CardSettings, IgContainer, IgContainerSettings }} >
        <div className="grid grid-cols-[3fr_1fr] h-full w-full lg:mb-0">
          <div className='flex justify-center items-normal h-full w-full'>
              <UrlConverter onConvert={handleConvert} className="url-converter-sidebar" />
        

              {selectedCard === 'Facebook' && (
               <div className='flex flex-col justify-normal items-center h-full w-full ml-12'>
                  <h1 className='text-blue-500 text-center py-5 text-xl font-bold'>Facebook Image Card Preview</h1>
                  <Frame key={`facebook-${JSON.stringify(convertedData)}`}>
                    <Element is={FbContainer} canvas>
                      <Element is={Post} background={"#fff"} containerType="facebook" h1={convertedData?.h1} h2={convertedData?.h2} img={convertedData?.img} />
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
                          <Element is={Post} background={"#fff"} containerType="instagram" h1={convertedData?.h1} h2={convertedData?.h2} img={convertedData?.img} />
                        </Element>
                      </div>
                    </div>
                  </Frame>
              </div>
              )}
          </div>
          <div className='fixed right-0 top-0 z-10 w-[15vw] max-w-[15vw] min-w-[15vw] bg-zinc-800 h-full overflow-y-auto pt-6'>
            <div className='flex flex-col justify-center items-center gap-1 px-2 overflow-y-auto'>
              <h1 className='text-white text-base text-center font-medium'>Select SM Card Type</h1>
              <select className='bg-white border border-gray-300 rounded-sm p-1' value={selectedCard} onChange={(e) => handleCardChange(e.target.value)}>
                <option value="Facebook">Facebook Card</option>
                <option value="Instagram">Instagram Card</option>
              </select>
              <CardTools />
              <SettingsPanel />
              <span className='bg-white w-full mt-4'><Layers expanded/></span>
              <div className='flex flex-col gap-2 mt-12 w-full'>
                <button onClick={openModal} className="text-gradient font-bold border border-1 border-primary p-2 text-center mt-4 hover:bg-primary hover:text-white ">
                  Save Template
                </button>             
                  <div className='w-full bg-zinc-800 p-4'>
                    <StoredTemplates session={session} />
                  </div>
              </div>
            </div>
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