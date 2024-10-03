import { render, screen, waitFor } from '@tests/testing';
import CardCarousel from '.';
describe('card carousel', () => {
  it('should render without children', async () => {
    await waitFor(() => {
      render(
        <div>
          <CardCarousel currentIndex={1}></CardCarousel>
        </div>,
      );
    });
  });

  it('should render the item at the current index', async () => {
    await waitFor(() => {
      render(
        <div>
          <CardCarousel currentIndex={1}>
            {[
              <div key={'1'}>First Item</div>,
              <div key={'2'}>Second Item</div>,
              <div key={'3'}>Third Item</div>,
            ]}
          </CardCarousel>
        </div>,
      );
    });

    expect(screen.getByText('Second Item')).toBeInTheDocument();
  });
});
