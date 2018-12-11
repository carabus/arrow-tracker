import React from 'react';
import { shallow } from 'enzyme';

import { End } from './end';

import {
  createEnd,
  fetchSessions,
  createArrow,
  removeLastArrow,
  updateSession
} from '../actions';

describe('<End/>', () => {
  const endNum = 1;
  const arrow = { coordinates: { x: 1, y: 1 }, score: 20 };
  const end = { _id: 1, arrows: [arrow] };
  const session = {
    distance: 20,
    distanceUnits: 'yards',
    score: 100,
    maxScore: 200,
    trainingFactors: ['test'],
    ends: [end],
    targetType: 'olympic'
  };

  const dispatch = jest.fn();

  it('Renders without crashing', () => {
    shallow(<End session={session} end={end} endNum={1} />);
  });

  it('Shows loading message when data still loading ', () => {
    const wrapper = shallow(
      <End session={null} end={null} isLoading={true} dispatch={dispatch} />
    );
    expect(wrapper.contains('Loading...')).toEqual(true);
  });

  it('Shows display not found message when there is no such end', () => {
    const wrapper = shallow(
      <End session={null} end={null} isLoading={false} dispatch={dispatch} />
    );
    expect(wrapper.contains('No such End')).toEqual(true);
  });

  it('Shows End page', () => {
    const wrapper = shallow(
      <End
        session={session}
        end={end}
        endNum={1}
        isLoading={false}
        dispatch={dispatch}
      />
    );
    expect(wrapper.contains(<h1>End #{endNum}</h1>)).toEqual(true);
  });

  it('Dispatches add arrow when miss is clicked', () => {
    const wrapper = shallow(
      <End
        session={session}
        end={end}
        endNum={1}
        isLoading={false}
        dispatch={dispatch}
      />
    );
    wrapper.find('.button-miss').simulate('click');
    expect(dispatch).toHaveBeenCalledWith(
      createArrow(session, end, { x: -1, y: -1 }, 0, false)
    );
  });

  it('Dispatches remove last arrow when Undo is clicked', () => {
    const wrapper = shallow(
      <End
        session={session}
        end={end}
        endNum={1}
        isLoading={false}
        dispatch={dispatch}
      />
    );
    wrapper.find('.button-undo').simulate('click');
    expect(dispatch).toHaveBeenCalledWith(removeLastArrow(session, end));
  });
});
