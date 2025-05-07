import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import type { Props } from '@theme/Footer/Layout';
import { Icon, IconButton, Link, Paper } from '@mui/material';
import RightArrow from '../../../../static/img/Footer/arrow.svg';
import UpArrow from '../../../../static/img/Footer/arrow_up.svg';
import Github from '../../../../static/img/Footer/github.svg';
import X from '../../../../static/img/Footer/x.svg';
import UpperRightArrow from '../../../../static/img/Footer/arrow_upper_right.svg';
import LogoStyles from '../../../../static/img/Footer/logo_styled.svg';



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
              <Paper
                sx={{
                  backgroundColor: '#5438DC',
                  paddingLeft: '30.51px',
                  paddingRight: '30.26px',
                  borderRadius: '16px',
                }}
              >
                <div className='!pb-0 !mt-[30.51px] !mb-[301.57px]'>
                  <h2 className='!text-[35.6px] !font-medium leading-[42.72px] tracking-[-0.356px]'>Subscribe to our <br />
                    Newsletter</h2>
                </div>
                <div>
                  <div className='flex gap-x-[169.45px] pr-[6.14px]'>
                    <p className='!text-[17.8px] leading-[24.92px]'>accounts@saib.dev</p>
                    <RightArrow />
                  </div>
                  <hr className='!mt-[10.17px] !mb-[37.48px]' />
                </div>
              </Paper>
              <div className='flex gap-x-[10px]'>
                <div>
                  <IconButton LinkComponent={'a'}
                    href='#'
                    sx={{
                      padding: 0,
                      opacity: 0.6,
                      '&:hover': {
                        opacity: 1,
                      },
                    }}>
                    <UpArrow />
                  </IconButton>
                </div>
                <div className='flex flex-col gap-y-[10px]'>
                  <IconButton
                    LinkComponent={'a'}
                    href="https://github.com"
                    target="_blank"
                    rel="noopener"
                    sx={{
                      padding: 0,
                      opacity: 0.6,
                      '&:hover': {
                        opacity: 1,
                      },
                    }}>
                    <Github href='https://github.com/SAIB-Inc' />
                  </IconButton>
                  <IconButton
                    sx={{
                      padding: 0,
                      opacity: 0.6,
                      '&:hover': {
                        opacity: 1,
                      },
                    }}>
                    <X/>
                  </IconButton>
                </div>
              </div>
            </div>

            <div className='relative'>
              <img src="img/Footer/wizard.svg" alt="Wizard" className='absolute right-[44.5px] top-[-138.14px]' />
              <LogoStyles className='absolute top-[226.18px] left-[126.5px]' />
              <img src="img/Footer/logo_icon.svg" alt="Logo Icon" className='absolute right-[141px] top-[-127px]' />
              <div className='flex gap-x-[31px] mb-[61.02px]'>
                <h3 className='!text-[25.43px] leading-[30.516px] tracking-[-0.2543px] !font-normal !mb-0'>For Inquiries</h3>
                <h3 className='!text-[25.43px] leading-[30.516px] tracking-[-0.2543px] !font-normal !text-[#717171] !mb-0'>/</h3>
                <h3 className='!text-[25.43px] leading-[30.516px] tracking-[-0.2543px] !font-normal !mb-0'>For Developer</h3>
              </div>

              <div className='flex justify-between gap-x-[390px]'>
                <div>
                  <div className='mb-[60.64px]'>
                    <p className='!text-[12.71px] leading-[17.794px] tracking-[0.5084px] text-[#717171] font-medium'>INFO</p>
                  </div>
                  <div>
                    <div className='flex flex-col gap-y-[10.17px]'>
                      <Link
                        href="https://calendly.com/saibdev"
                        target="_blank"
                        rel="noopener"
                        sx={{
                          color: 'white',
                          fontSize: '25.43px',
                          lineHeight: '30.516px',
                          letterSpacing: '-0.2543px',
                          textDecoration: 'none',
                          '&:visited': {
                            color: 'white', // stop the purple visited color
                          },
                          '&:hover': {
                            color: 'white', // optional: keep white on hover
                          },
                        }}
                        underline="none">
                        Contact Us
                      </Link>
                      <Link
                        href=""
                        target="_blank"
                        rel="noopener"
                        sx={{
                          color: 'white',
                          fontSize: '25.43px',
                          lineHeight: '30.516px',
                          letterSpacing: '-0.2543px',
                          textDecoration: 'none',
                          '&:visited': {
                            color: 'white', // stop the purple visited color
                          },
                          '&:hover': {
                            color: 'white', // optional: keep white on hover
                          },
                        }}
                        underline="none">
                        Documentation
                      </Link>
                    </div>
                    <div>
                      <Link
                        href="https://saib.dev/"
                        target="_blank"
                        rel="noopener"
                        sx={{
                          display: 'flex',
                          gap: '10.17px',
                          alignItems: 'center',
                          marginTop: '10.17px',
                          color: 'white',
                          fontSize: '25.43px',
                          lineHeight: '30.516px',
                          letterSpacing: '-0.2543px',
                          textDecoration: 'none',
                          '&:visited': {
                            color: 'white',
                          },
                          '&:hover': {
                            color: 'white',
                          },
                        }}
                        underline="none"
                      >
                        SAIB
                        <UpperRightArrow />
                      </Link>
                    </div>

                  </div>
                </div>

                <div>
                  <div className='mb-[60.64px]'>
                    <p className='!text-[12.71px] leading-[17.794px] tracking-[0.5084px] text-[#717171] font-medium'>REPOSITORY LINKS</p>
                  </div>
                  <div className='flex flex-col gap-y-[7.63px]'>
                    <Link
                      href="https://github.com/SAIB-Inc/Argus"
                      target="_blank"
                      rel="noopener"
                      sx={{
                        color: 'white',
                        fontSize: '17.8px',
                        lineHeight: '24.92px',
                        textDecoration: 'none',
                        '&:visited': {
                          color: 'white',
                        },
                        '&:hover': {
                          color: 'white',
                        },
                      }}
                      underline="none"
                    >
                      Argus
                    </Link>
                    <Link
                      href="https://github.com/SAIB-Inc/Chrysalis"
                      target="_blank"
                      rel="noopener"
                      sx={{
                        color: 'white',
                        fontSize: '17.8px',
                        lineHeight: '24.92px',
                        textDecoration: 'none',
                        '&:visited': {
                          color: 'white',
                        },
                        '&:hover': {
                          color: 'white',
                        },
                      }}
                      underline="none"
                    >
                      Chrysalis
                    </Link>
                    <Link
                      href="https://github.com/SAIB-Inc/Razor"
                      target="_blank"
                      rel="noopener"
                      sx={{
                        color: 'white',
                        fontSize: '17.8px',
                        lineHeight: '24.92px',
                        textDecoration: 'none',
                        '&:visited': {
                          color: 'white',
                        },
                        '&:hover': {
                          color: 'white',
                        },
                      }}
                      underline="none"
                    >
                      Razor
                    </Link>
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
      </div>
      <div className='h-[57px] bg-[#151515] flex items-center'>
        {copyright}
      </div>

    </footer>
  );
}
