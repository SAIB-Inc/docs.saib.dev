import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import type {Props} from '@theme/Footer/Layout';
import RightArrow from '../../../../static/img/Footer/arrow.svg';
import UpArrow from '../../../../static/img/Footer/arrow_up.svg';
import Github from '../../../../static/img/Footer/github.svg';
import Discord from '../../../../static/img/Footer/discord.svg';
import UpperRightArrow from '../../../../static/img/Footer/arrow_upper_right.svg';

export default function FooterLayout({
  style,
  links,
  logo,
  copyright,
}: Props): ReactNode {
  return (
    <footer className='h-[1078px]'>
      <div className='bg-[url(/img/Footer/background.webp)] bg-cover bg-no-repeat place-items-center'>
        <div className="container h-[1021px] !p-0 !pt-67">
          {/* {links} */}
          <div className='flex gap-x-20'>
            <div className='flex flex-col gap-y-[127.3px]'>
              <div className='bg-[#5438DC] pl-[30.51px] pr-[30.26px] rounded-2xl'> {/* MUI Paper or Button */}
                <div className='!pb-0 !mt-[30.51px] !mb-[301.57px]'>
                  <h2 className='!text-[35.6px] !font-medium leading-[42.72px] tracking-[-0.356px]'>Subscribe to our <br />
                  Newsletter</h2>
                </div>
                <div>
                  <div className='flex gap-x-[169.45px] pr-[6.14px]'>
                    <p className='!text-[17.8px] leading-[24.92px]'>accounts@saib.dev</p>
                    <RightArrow/>
                  </div>
                  <hr className='!mt-[10.17px] !mb-[37.48px]'/>
                </div>
              </div>
              <div className='flex'>
                <div>
                  <UpArrow/>
                </div>
                <div className='flex flex-col gap-y-[10px]'>
                  <Github/>
                  <Discord/>
                </div>
              </div>
            </div>
            
            <div>
              <div className='flex gap-x-[31px] mb-[61.02px]'>
                <h3 className='!text-[25.43px] leading-[30.516px] tracking-[-0.2543px] !font-normal'>For Inquiries</h3>
                <h3 className='!text-[25.43px] leading-[30.516px] tracking-[-0.2543px] !font-normal !text-[#717171]'>/</h3>
                <h3 className='!text-[25.43px] leading-[30.516px] tracking-[-0.2543px] !font-normal'>For Developer</h3>
              </div>

              <div className='flex justify-between gap-x-[362px]'>
                <div>
                  <div className='mb-[60.64px]'>
                    <p className='!text-[12.71px] leading-[17.794px] tracking-[0.5084px] text-[#717171] font-medium'>INFO</p>
                  </div>
                  <div>
                    <div className='flex flex-col gap-y-[10.17px]'>
                      <p className='!text-[25.43px] leading-[30.516px] tracking-[-0.2543px]'>Contact Us</p>
                      <p className='!text-[25.43px] leading-[30.516px] tracking-[-0.2543px]'>Documentation</p>
                    </div>
                    <div className='flex gap-x-[10.17px] items-center mt-[10.17px]'>
                      <p className='!text-[25.43px] leading-[30.516px] tracking-[-0.2543px]'>FAQs</p> 
                      <UpperRightArrow/>
                    </div>
                    
                  </div>
                </div>

                <div>
                  <div className='mb-[60.64px]'>
                    <p className='!text-[12.71px] leading-[17.794px] tracking-[0.5084px] text-[#717171] font-medium'>ADDITIONAL LINKS</p>
                  </div>
                  <div className='flex flex-col gap-y-[7.63px]'>
                    <p className='!text-[17.8px] leading-[24.92px]'>Product Customization</p>
                    <p className='!text-[17.8px] leading-[24.92px]'>Community</p>
                    <p className='!text-[17.8px] leading-[24.92px]'>Corporate Repsonsibility</p>
                  </div>
                </div>
              </div>

              <div className='!mt-[395.82px] flex gap-x-15'>
                <div>
                  <p className='!text-[12.71px] leading-[17.794px] tracking-[0.5084px] text-[#717171] !mb-[10.17px]'>CORPORATE OFFICE</p>
                  <p className='!text=[17.8px] leading-[17.92px]'>Philippines</p>
                </div>
                <div>
                  <p className='!text-[12.71px] leading-[17.794px] tracking-[0.5084px] text-[#717171] !mb-[10.17px]'>PHONE</p>
                  <p className='!text=[17.8px] leading-[17.92px]'>+63 XXX XXX XXX</p>
                </div>
                <div>
                  <p className='!text-[12.71px] leading-[17.794px] tracking-[0.5084px] text-[#717171] !mb-[10.17px]'>EMAIL</p>
                  <p className='!text=[17.8px] leading-[17.92px]'>accounts@saib.dev</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          {(logo || copyright) && (
            <div className="footer__bottom text--center">
              {logo && <div className="margin-bottom--sm">{logo}</div>}
              {copyright}
            </div>
          )}
        </div>
      </div>
      
    </footer>
  );
}
