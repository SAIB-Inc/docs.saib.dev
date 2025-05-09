import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import type { Props } from '@theme/Footer/Layout';
import { Icon, IconButton, Link, Paper, useTheme } from '@mui/material';
import { useColorMode } from '@docusaurus/theme-common';
import BackgroundLines from '../../../../static/img/Footer/background_lines.svg';
import FooterWizard from '@site/static/img/Footer/wizard';
import GithubIcon from '@site/static/img/Footer/github';
import XIcon from '@site/static/img/Footer/x';
import ScrollUpIcon from '@site/static/img/Footer/scroll_up';
import UpperRightArrowIcon from '@site/static/img/Footer/arrow_upper_right';



export default function FooterLayout({
  style,
  links,
  logo,
  copyright,
}: Props): ReactNode {

  const theme = useTheme();
  const { colorMode } = useColorMode();

  return (
    <footer style={{backgroundColor: theme.palette.background.default}} className='md:h-[1078px]'>
      <div className={`place-items-center relative ${colorMode === 'dark' ? "bg-[url(/img/Footer/background_dark.webp)]" : "bg-[url(/img/Footer/background_light.webp)]"} bg-cover bg-no-repeat `}>
        <div>
          <BackgroundLines />
        </div>
        <div className="container !px-4 md:!p-0 md:!pt-67 md:h-[1021px]">
          <div className='flex gap-x-20 h-full flex-col-reverse md:flex-row'>
            <div className='flex flex-col gap-y-8 md:gap-y-[127.3px]'>
              <div className='relative w-max mx-auto'>
                <img src="img/Footer/logo_icon.svg" alt="Logo Icon" className='absolute right-[90px] top-[14px]' />
                <FooterWizard sx={{ color: theme.palette.text.secondary }} className='!relative !text-[210.14px] md:hidden'/>
              </div>
              <Paper
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  paddingLeft: '30.51px',
                  paddingRight: '30.26px',
                  borderRadius: '16px',
                }}
              >
                <div className='!pb-0 !mt-[30.51px] !mb-20 md:!mb-[160.49px]'>
                  <p style={{color: theme.palette.grey[50]}} className='!font-medium !mb-10 !text-2xl md:leading-[42.72px] md:tracking-[-0.356px] md:!text-[35.6px]'>
                    Fueling the future <br className='hidden md:block'/>
                    with bold ideas and <br className='hidden md:block'/>
                    unstoppable energy.
                  </p>
                  <p style={{color: theme.palette.grey[50]}} className='!font-medium !text-2xl md:leading-[42.72px] md:tracking-[-0.356px] md:!text-[35.6px]'>
                    Stay in the loop, <br className='hidden md:block'/>
                    follow us on our <br className='hidden md:block'/>
                    socials!
                  </p>
                </div>
              </Paper>
              <div className='flex gap-x-[10px] flex-row-reverse justify-between md:justify-start md:flex-row'>
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
                      <ScrollUpIcon sx={{ color: theme.palette.primary.contrastText }} className="!text-[56px] md:!text-[111.88px]"/>
                    </IconButton>
                  </div>
                  <div className='flex gap-y-[10px] flex-row gap-x-2 md:gap-x-0 md:flex-col'>
                    <IconButton
                      LinkComponent={'a'}
                      href="https://github.com/SAIB-Inc"
                      target="_blank"
                      rel="noopener"
                      sx={{
                        padding: 0,
                        opacity: 0.6,
                        '&:hover': {
                          opacity: 1,
                        },
                      }}>
                      <GithubIcon sx={{ color: theme.palette.primary.contrastText }} className="!text-5xl md:!text-[50.85px]"/>
                    </IconButton>
                    <IconButton
                      sx={{
                        padding: 0,
                        opacity: 0.6,
                        '&:hover': {
                          opacity: 1,
                        },
                      }}>
                      <XIcon sx={{ color: theme.palette.primary.contrastText }} className="!text-5xl md:!text-[50.85px]"/>
                    </IconButton>
                  </div>
                </div>
                <div className='w-full flex items-center justify-between md:hidden'>
                  <div className='flex flex-col self-end !mb-[21.83px] gap-y-2 md:gap-x-15'>
                    <div>
                      <p style={{color: theme.palette.grey[100]}} className='leading-[17.794px] tracking-[0.5084px] !mb-[10.17px] !text-[11px] md:!text-[12.71px]'>CORPORATE OFFICE</p>
                      <p className='!text-sm md:!text=[17.8px] md:leading-[17.92px]'>Philippines</p>
                    </div>
                    <div>
                      <p style={{color: theme.palette.grey[100]}} className='leading-[17.794px] tracking-[0.5084px] !mb-[10.17px] !text-[11px] md:!text-[12.71px]'>PHONE</p>
                      <p className='!text-sm md:!text=[17.8px] md:leading-[17.92px]'>+63 XXX XXX XXX</p>
                    </div>
                    <div>
                      <p style={{color: theme.palette.grey[100]}} className='leading-[17.794px] tracking-[0.5084px] !mb-[10.17px] !text-[11px] md:!text-[12.71px]'>EMAIL</p>
                      <p className='!text-sm md:!text=[17.8px] md:leading-[17.92px]'>accounts@saib.dev</p>
                    </div>
                  </div>
                  <div className='w-36'>
                    <img src={`${colorMode=='dark'? "img/Footer/logo_styled_dark.svg" : "img/Footer/logo_styled_light.svg"}`} alt="styled logo" />
                  </div>
                </div>
            </div>

            <div className='relative flex flex-col justify-between'>
              <FooterWizard sx={{ color: theme.palette.text.secondary }} className='!text-[210.14px] absolute right-[44.5px] top-[-138.14px] !hidden md:block'/>
              <img src={`${colorMode=='dark'? "img/Footer/logo_styled_dark.svg" : "img/Footer/logo_styled_light.svg"}`} alt="" className='absolute top-[226.18px] left-[126.5px] hidden md:block' />
              <img src="img/Footer/logo_icon.svg" alt="Logo Icon" className='absolute right-[141px] top-[-127px] hidden md:block' />

              <div className='mb-10 md:mb-0'>
                <div className='flex flex-col text-center mb-10 md:gap-x-[31px] md:mb-[61.02px] md:flex-row'>
                  <h3 className='leading-[30.516px] tracking-[-0.2543px] !font-normal !mb-0 !text-base md:!text-[25.43px]'>For Inquiries</h3>
                  <h3 style={{color: theme.palette.grey[100]}} className='leading-[30.516px] tracking-[-0.2543px] !font-normal !mb-0 !text-[25.43px] hidden md:block'>/</h3>
                  <h3 className='leading-[30.516px] tracking-[-0.2543px] !font-normal !mb-0 !text-base md:!text-[25.43px]'>For Developer</h3>
                </div>

                <div className='flex justify-between gap-x-[460px] flex-col md:flex-row'>
                  <div className='text-center md:text-start'>
                    <div className='md:mb-[60.64px]'>
                      <p style={{color: theme.palette.grey[100]}} className='!text-[12.71px] leading-[17.794px] tracking-[0.5084px] font-medium'>INFO</p>
                    </div>
                    <div>
                      <div className='flex flex-col gap-y-[10.17px]'>
                        <Link
                          href="https://calendly.com/saibdev"
                          target="_blank"
                          rel="noopener"
                          sx={{
                            color: theme.palette.text.primary,
                            lineHeight: '30.516px',
                            letterSpacing: '-0.2543px',
                            textDecoration: 'none',
                            '&:visited': {
                              color: theme.palette.text.primary,
                            },
                            '&:hover': {
                              color: theme.palette.text.primary,
                            },
                          }}
                          className='!text-base md:!text-[25.43px]'
                          underline="none">
                          Contact Us
                        </Link>
                        <Link
                          href=""
                          target="_blank"
                          rel="noopener"
                          sx={{
                            color: theme.palette.text.primary,
                            lineHeight: '30.516px',
                            letterSpacing: '-0.2543px',
                            textDecoration: 'none',
                            '&:visited': {
                              color: theme.palette.text.primary,
                            },
                            '&:hover': {
                              color: theme.palette.text.primary,
                            },
                          }}
                          className='!text-base md:!text-[25.43px]'
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
                            color: theme.palette.text.primary,
                            lineHeight: '30.516px',
                            letterSpacing: '-0.2543px',
                            textDecoration: 'none',
                            '&:visited': {
                              color: theme.palette.text.primary,
                            },
                            '&:hover': {
                              color: theme.palette.text.primary,
                            },
                          }}
                          className='!text-base !justify-center md:!justify-start md:!text-[25.43px]'
                          underline="none"
                        >
                          SAIB
                          <UpperRightArrowIcon 
                            sx={{
                              color:theme.palette.text.primary,
                            }}
                            className='!text-base md:!text-2xl'
                          />
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className='flex items-center justify-center md:block md:mb-[60.64px]'>
                      <p style={{color: theme.palette.grey[100]}} className='!text-[12.71px] leading-[17.794px] tracking-[0.5084px] font-medium'>DOCUMENTATION LINKS</p>
                    </div>
                    <div className='flex flex-col items-center gap-y-[7.63px] md:items-start'>
                      <Link
                        href="https://github.com/SAIB-Inc/Argus"
                        target="_blank"
                        rel="noopener"
                        sx={{
                          color: theme.palette.text.primary,
                          lineHeight: '30.516px',
                          letterSpacing: '-0.2543px',
                          textDecoration: 'none',
                          '&:visited': {
                            color: theme.palette.text.primary,
                          },
                          '&:hover': {
                            color: theme.palette.text.primary,
                          },
                        }}
                        className='!text-base md:!text-[25.43px]'
                        underline="none"
                      >
                        Argus
                      </Link>
                      <Link
                        href="https://github.com/SAIB-Inc/Chrysalis"
                        target="_blank"
                        rel="noopener"
                        sx={{
                          color: theme.palette.text.primary,
                          lineHeight: '30.516px',
                          letterSpacing: '-0.2543px',
                          textDecoration: 'none',
                          '&:visited': {
                            color: theme.palette.text.primary,
                          },
                          '&:hover': {
                            color: theme.palette.text.primary,
                          },
                        }}
                        className='!text-base md:!text-[25.43px]'
                        underline="none"
                      >
                        Chrysalis
                      </Link>
                      <Link
                        href="https://github.com/SAIB-Inc/COMP"
                        target="_blank"
                        rel="noopener"
                        sx={{
                          color: theme.palette.text.primary,
                          lineHeight: '30.516px',
                          letterSpacing: '-0.2543px',
                          textDecoration: 'none',
                          '&:visited': {
                            color: theme.palette.text.primary,
                          },
                          '&:hover': {
                            color: theme.palette.text.primary,
                          },
                        }}
                        className='!text-base md:!text-[25.43px]'
                        underline="none"
                      >
                        COMP
                      </Link>
                      <Link
                        href=""
                        target="_blank"
                        rel="noopener"
                        sx={{
                          color: theme.palette.text.primary,
                          lineHeight: '30.516px',
                          letterSpacing: '-0.2543px',
                          textDecoration: 'none',
                          '&:visited': {
                            color: theme.palette.text.primary,
                          },
                          '&:hover': {
                            color: theme.palette.text.primary,
                          },
                        }}
                        className='!text-base md:!text-[25.43px]'
                        underline="none"
                      >
                        Futura
                      </Link>
                      <Link
                        href="https://github.com/SAIB-Inc/Razor"
                        target="_blank"
                        rel="noopener"
                        sx={{
                          color: theme.palette.text.primary,
                          lineHeight: '30.516px',
                          letterSpacing: '-0.2543px',
                          textDecoration: 'none',
                          '&:visited': {
                            color: theme.palette.text.primary,
                          },
                          '&:hover': {
                            color: theme.palette.text.primary,
                          },
                        }}
                        className='!text-base md:!text-[25.43px]'
                        underline="none"
                      >
                        Razor
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className='hidden md:block'>
                <div className='flex gap-x-15 self-end !mb-[21.83px]'>
                  <div>
                    <p style={{color: theme.palette.grey[100]}} className='!text-[12.71px] leading-[17.794px] tracking-[0.5084px] !mb-[10.17px]'>CORPORATE OFFICE</p>
                    <p className='md:!text=[17.8px] md:leading-[17.92px]'>Philippines</p>
                  </div>
                  <div>
                    <p style={{color: theme.palette.grey[100]}} className='!text-[12.71px] leading-[17.794px] tracking-[0.5084px] !mb-[10.17px]'>PHONE</p>
                    <p className='md:!text=[17.8px] md:leading-[17.92px]'>+63 XXX XXX XXX</p>
                  </div>
                  <div>
                    <p style={{color: theme.palette.grey[100]}} className='!text-[12.71px] leading-[17.794px] tracking-[0.5084px] !mb-[10.17px]'>EMAIL</p>
                    <p className='md:!text=[17.8px] md:leading-[17.92px]'>accounts@saib.dev</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{background: theme.palette.grey.A100}} className='h-[57px] flex items-center'>
        {copyright}
      </div>

    </footer>
  );
}
