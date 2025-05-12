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
import ExternalLink from '@site/src/components/Shared/Links/ExternalLink/ExternalLink';



export default function FooterLayout({
  style,
  links,
  logo,
  copyright,
}: Props): ReactNode {

  const theme = useTheme();
  const { colorMode } = useColorMode();
  const scrollToFirstSection = () => {
    const nextSection = document.getElementById("section-1");
    if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
    }
};
  return (
    <footer style={{backgroundColor: theme.palette.background.default}} className='!pt-30 lg:!pt-0 md:h-[1078px]'>
      <div className={`place-items-center relative ${colorMode === 'dark' ? "bg-[url(/img/Footer/background_dark.webp)]" : "bg-[url(/img/Footer/background_light.webp)]"} bg-cover bg-no-repeat `}>
        <div className="container !px-4 md:!pt-67 md:h-[1021px]">
          {/* {links} */}
          <div className='flex gap-x-20 h-full flex-col-reverse lg:flex-row'>
            <div className='flex flex-col gap-y-8 lg:justify-between lg:!mb-[21.83px]'>
              <div className='relative w-max mx-auto sm:!hidden'>
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
                <div className='!pb-0 !mt-[30.51px] !mb-20 lg:!mb-[160.49px]'>
                  <p style={{color: theme.palette.grey[50]}} className='!font-medium !mb-10 !text-2xl md:leading-[42.72px] md:tracking-[-0.356px] md:!text-[35.6px]'>
                    Fueling the future <br className='hidden lg:block'/>
                    with bold ideas and <br className='hidden lg:block'/>
                    unstoppable energy.
                  </p>
                  <p style={{color: theme.palette.grey[50]}} className='!font-medium !text-2xl md:leading-[42.72px] md:tracking-[-0.356px] md:!text-[35.6px]'>
                    Stay in the loop, <br className='hidden lg:block'/>
                    follow us on our <br className='hidden lg:block'/>
                    socials!
                  </p>
                </div>
              </Paper>
              <div className='flex gap-x-[10px] flex-row-reverse justify-between lg:justify-start lg:flex-row'>
                  <div>
                    <IconButton 
                      LinkComponent={'a'}
                      sx={{
                        padding: 0,
                        opacity: 0.6,
                        '&:hover': {
                          backgroundColor: 'transparent',
                          opacity: 1,
                        },
                      }}
                      onClick={scrollToFirstSection}
                      className='!transition-all !duration-300 !ease-in-out'>
                      <ScrollUpIcon sx={{ color: theme.palette.primary.contrastText }} className="!text-[56px] sm:!text-[70px] lg:!text-[111.88px]"/>
                    </IconButton>
                  </div>
                  <div className='flex gap-y-[10px] flex-row gap-x-2 lg:gap-x-0 lg:flex-col'>
                    <IconButton
                      LinkComponent={ExternalLink}
                      href="https://github.com/SAIB-Inc"
                      sx={{
                        padding: 0,
                        opacity: 0.6,
                        '&:hover': {
                          backgroundColor: 'transparent',
                          opacity: 1,
                        },
                      }}
                      className='!transition-all !duration-300 !ease-in-out'>
                      <GithubIcon sx={{ color: theme.palette.primary.contrastText }} className="!text-5xl md:!text-[50.85px]"/>
                    </IconButton>
                    <IconButton
                      LinkComponent={ExternalLink}
                      href="https://x.com/saibdev"
                      sx={{
                        padding: 0,
                        opacity: 0.6,
                        '&:hover': {
                          backgroundColor: 'transparent',
                          opacity: 1,
                        },                        
                      }}
                      className='!transition-all !duration-300 !ease-in-out'>
                      <XIcon sx={{ color: theme.palette.primary.contrastText }} className="!text-5xl md:!text-[50.85px]"/>
                    </IconButton>
                  </div>
                </div>
                <div className='w-full flex items-center justify-between lg:hidden'>
                  <div className='flex flex-col self-end !mb-[21.83px] gap-y-2 md:gap-x-15'>
                    <div>
                      <p style={{color: theme.palette.grey[100]}} className='leading-[17.794px] tracking-[0.5084px] !mb-[10.17px] !text-[11px] md:!text-[12.71px]'>CORPORATE OFFICE</p>
                      <p className='!text-sm md:!text-[17.8px] md:leading-[17.92px]'>Philippines</p>
                    </div>
                    <div>
                      <p style={{color: theme.palette.grey[100]}} className='leading-[17.794px] tracking-[0.5084px] !mb-[10.17px] !text-[11px] md:!text-[12.71px]'>PHONE</p>
                      <p className='!text-sm md:!text-[17.8px] md:leading-[17.92px]'>+63 XXX XXX XXX</p>
                    </div>
                    <div>
                      <p style={{color: theme.palette.grey[100]}} className='leading-[17.794px] tracking-[0.5084px] !mb-[10.17px] !text-[11px] md:!text-[12.71px]'>EMAIL</p>
                      <p className='!text-sm md:!text-[17.8px] md:leading-[17.92px]'>accounts@saib.dev</p>
                    </div>
                  </div>
                  <div className='w-36'>
                    <img src={`${colorMode=='dark'? "img/Footer/logo_styled_dark.svg" : "img/Footer/logo_styled_light.svg"}`} alt="styled logo" />
                  </div>
                </div>
            </div>

            <div className='relative flex flex-col justify-between'>
              <FooterWizard sx={{ color: theme.palette.text.secondary }} className='!text-[210.14px] absolute right-[44.5px] top-[-138.14px] !hidden lg:!block'/>
              <img src={`${colorMode=='dark'? "img/Footer/logo_styled_dark.svg" : "img/Footer/logo_styled_light.svg"}`} alt="logo styled" className='absolute hidden lg:block lg:w-80 lg:top-[274.18px] lg:left-[18.5px] xl:top-[275.18px] 2xl:top-[226.18px] xl:left-[70.5px] 2xl:left-[126.5px] 2xl:w-auto' />
              <img src="img/Footer/logo_icon.svg" alt="Logo Icon" className='absolute right-[141px] top-[-127px] hidden lg:block' />

              <div className='mb-10 lg:mb-0'>
                <div className='flex flex-col text-center mb-10 sm:flex-row sm:gap-x-5 xl:gap-x-[31px] md:mb-[61.02px]'>
                  <h3 className='leading-[30.516px] tracking-[-0.2543px] !font-normal !mb-0 !text-base md:!text-xl lg:!text-[25.43px]'>For Inquiries</h3>
                  <h3 style={{color: theme.palette.grey[100]}} className='leading-[30.516px] tracking-[-0.2543px] !font-normal !mb-0 !text-[25.43px] hidden sm:block'>/</h3>
                  <h3 className='leading-[30.516px] tracking-[-0.2543px] !font-normal !mb-0 !text-base md:!text-xl lg:!text-[25.43px]'>For Developer</h3>
                </div>

                <div className='flex justify-between flex-col sm:justify-start sm:gap-18 sm:flex-row lg:gap-x-47 xl:gap-x-[249px] 2xl:gap-x-[460px]'>
                  <div className='text-center sm:text-start'>
                    <div className='md:mb-10 lg:mb-[60.64px]'>
                      <p style={{color: theme.palette.grey[100]}} className='!text-[12.71px] leading-[17.794px] tracking-[0.5084px] font-medium !mb-[10.17px] md:!mb-0'>INFO</p>
                    </div>
                    <div>
                      <div className='flex flex-col gap-y-[10.17px]'>
                        <Link
                          href="https://calendly.com/saibdev"
                          target="_blank"
                          rel="noopener noreferrer"
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
                          className='!text-base md:!text-xl lg:!text-[25.43px]'
                          underline="none">
                          Contact Us
                        </Link>
                        <Link
                          href="/docs/chrysalis/overview"
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
                          className='!text-base md:!text-xl lg:!text-[25.43px]'
                          underline="none">
                          Documentation
                        </Link>
                      </div>
                      <div>
                        <Link
                          href="https://saib.dev/"
                          target="_blank"
                          rel="noopener noreferrer"
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
                          className='!text-base !justify-center sm:!justify-start md:!text-xl lg:!text-[25.43px]'
                          underline="none"
                        >
                          SAIB
                          <UpperRightArrowIcon 
                            sx={{
                              color:theme.palette.text.primary,
                            }}
                            className='!text-base md:!text-xl lg:!text-2xl'
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className='sm:w-full lg:w-auto'>
                    <div className='flex items-center justify-center !mt-10 md:block sm:!justify-start sm:!mt-0 md:mb-10 lg:mb-[60.64px]'>
                      <p style={{color: theme.palette.grey[100]}} className='!text-[12.71px] leading-[17.794px] tracking-[0.5084px] font-medium !mb-[7.63px] md:!mb-0'>DOCUMENTATION LINKS</p>
                    </div>
                    <div className='flex flex-col items-center gap-y-[7.63px] sm:items-start'>
                      <Link
                        href="/docs/argus/intro"
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
                        className='!text-base md:!text-xl lg:!text-[25.43px]'
                        underline="none"
                      >
                        Argus
                      </Link>
                      <Link
                        href="/docs/chrysalis/overview"
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
                        className='!text-base md:!text-xl lg:!text-[25.43px]'
                        underline="none"
                      >
                        Chrysalis
                      </Link>
                      <Link
                        href="/docs/comp/overview"
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
                        className='!text-base md:!text-xl lg:!text-[25.43px]'
                        underline="none"
                      >
                        COMP
                      </Link>
                      <Link
                        href="/docs/futura/overview"
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
                        className='!text-base md:!text-xl lg:!text-[25.43px]'
                        underline="none"
                      >
                        Futura
                      </Link>
                      <Link
                        href="/docs/razor/overview"
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
                        className='!text-base md:!text-xl lg:!text-[25.43px]'
                        underline="none"
                      >
                        Razor
                      </Link>
                    </div>
                  </div>
                  <div className='relative w-full hidden justify-end items-center sm:flex lg:hidden'>
                    <img src="img/Footer/logo_icon.svg" alt="Logo Icon" className='absolute right-[90px] top-[14px]' />
                    <FooterWizard sx={{ color: theme.palette.text.secondary }} className='!relative !text-[210.14px] lg:!hidden'/>
                  </div>
                </div>
              </div>

              <div className='hidden lg:block'>
                <div className='flex self-end !mb-[21.83px] lg:gap-x-6 xl:gap-x-15'>
                  <div>
                    <p style={{color: theme.palette.grey[100]}} className='!text-[12.71px] leading-[17.794px] tracking-[0.5084px] !mb-[10.17px]'>CORPORATE OFFICE</p>
                    <p className='md:!text-[17.8px] md:leading-[17.92px]'>Philippines</p>
                  </div>
                  <div>
                    <p style={{color: theme.palette.grey[100]}} className='!text-[12.71px] leading-[17.794px] tracking-[0.5084px] !mb-[10.17px]'>PHONE</p>
                    <p className='md:!text-[17.8px] md:leading-[17.92px]'>+63 XXX XXX XXX</p>
                  </div>
                  <div>
                    <p style={{color: theme.palette.grey[100]}} className='!text-[12.71px] leading-[17.794px] tracking-[0.5084px] !mb-[10.17px]'>EMAIL</p>
                    <p className='md:!text-[17.8px] md:leading-[17.92px]'>accounts@saib.dev</p>
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
