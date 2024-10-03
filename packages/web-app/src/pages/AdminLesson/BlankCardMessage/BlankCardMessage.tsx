import { FC, Fragment, useEffect, useRef } from 'react';
import { Typography } from 'antd';
import lottie, { AnimationItem } from 'lottie-web';
import ArrowLottieData from '../../../../public/images/arrowLottieData.json';
import './BlankCardMessage.scss';

export const BlankCardMessage: FC = () => {
  const lottieContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationItem: AnimationItem | null = null;
    if (lottieContainer.current) {
      animationItem = lottie.loadAnimation({
        container: lottieContainer.current as Element,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: ArrowLottieData,
      });
    }
    return () => {
      animationItem?.destroy();
    };
  }, []);

  return (
    <Fragment>
      <div className='blank-card' ref={lottieContainer} />
      <Typography.Title level={2}>
        From text and images to video and more, the choice is yours! Explore
        <span className='blank-card--highlight'> content blocks!</span>
      </Typography.Title>
    </Fragment>
  );
};
