import React from 'react';
import './index.scss';
interface CardCarouselProps {
  currentIndex: number;
  children?: React.ReactNode[];
}

const CardCarousel = ({ children, currentIndex }: CardCarouselProps) => {
  return (
    <div className={'carousel__container'}>
      {children?.length ? children[currentIndex] : null}
    </div>
  );
};

export default CardCarousel;
