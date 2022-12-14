import styled from '@emotion/styled';
import cssUnit from 'src/lib/cssUnit';

import { Wrap } from 'src/styles/common';
import { UnderDevSection } from 'src/styles/compoStyles/underDev';
import Index from 'src/component/detail/Index';

// state
import { useSetRecoilState } from 'recoil';
import { useRecoilState } from 'recoil';
import { currentLoc } from 'src/state/navibar';
import CurrentMapState from 'src/state/currentMap';
import SearchAgainState from 'src/state/searchAgain';

import { createBrowserHistory } from 'history';

import { useRouter, history } from 'next/router';
import { useEffect } from 'react';
//import axios from 'axios';
//import { Get } from 'src/utils/api';
//for seo
import withGetServerSideProps from 'src/hocs/withServersideProps';

const DetailTitle = styled.div`
	//position: relative;
	//padding-top: 50px;
	//padding-bottom: 50px;

	position: sticky;
	top: 0px;

	width: 100%;

	list-style: none;

	padding-top: 40px;
	padding-bottom: 30px;

	z-index: 1;

	color: ${cssUnit.colors.White};
	font-size: ${cssUnit.fontSize.medium};
	text-align: center;
	line-height: 50px;

	background-color: ${cssUnit.colors.Black};

	/* @media screen and (max-width: 599px) {
		height: ${(props) => {
		return props.size ? props.size : '100%';
	}};
		:nth-of-type(2),
		:nth-of-type(3),
		:nth-of-type(4) {
			padding-top: 70px;
			padding-bottom: 100px;
		}
	} */

	//font-family: ${cssUnit.fontFamily.NanumM};
	//font-weight: 700;

	li {
		//position: relative;

		:after {
			content: '';
			display: block;
			position: absolute;

			width: 20vw;
			height: 0.5px;

			top: 70%;
			left: 40%;

			border-bottom: 5px solid ${cssUnit.colors.DarkGold};
		}
	}
`;
const DetailContainer = styled.div`
	margin: 0px auto;
	background-color: ${cssUnit.colors.DeepBlack};
	font-family: 'Noto serif KR', sans-serif;
	font-weight: bold;
	font-size: 25px;

	.detailBackground {
		background-color: ${cssUnit.backgroundColors.White};
	}
`;

const Detail = ({ pageData }) => {
	//console.log(pageData);
	const { item, sliderimgs } = pageData;
	//console.log ('??????????????? item', item);
	const router = useRouter();
	const setLoc = useSetRecoilState(currentLoc);
	const [currentMap, setCurrentMap] = useRecoilState(CurrentMapState);
	const [searchAgain, setSearchAgain] = useRecoilState(SearchAgainState);

	useEffect(() => {
		// ?????? ??????
		setLoc(router.pathname);
		setCurrentMap({
			mapKind: 'outer',
			name: '',
		});

		// item??? ????????? 404??? ?????? ??? (=????????? ????????? ??? ????????? ?????? ??? item??? withSer..?????? 404??? ?????????.)
		if (!item || item === '404') {
			router.push(`/404`);
			return;
		}

		// ?????? ?????????
		const curId = router.query.id;
		if (0 < curId && curId < 128) {
			renewWatched();
			return;
		}
	}, []);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const history = createBrowserHistory();
			// ???????????? ??? ????????? ?????????
			const listenBackEvent = () => {
				// ???????????? ??? ??? ????????? ??????
				if (history.location.pathname == '/search') {
					// ????????? ???????????? search??? ????????? ???????????? ??????
					setSearchAgain({
						...searchAgain,
						needed: true,
					});
				}
			};
			const unlistenHistoryEvent = history.listen(({ action }) => {
				if (action === 'POP') {
					listenBackEvent();
				}
			});
			return unlistenHistoryEvent;
		}
	}, []);

	// ?????? ?????????
	const renewWatched = () => {
		if (localStorage.getItem('watched') == null) {
			localStorage.setItem('watched', JSON.stringify([item.name]));
		} else {
			let arr = JSON.parse(localStorage.getItem('watched'));
			let isSameIncluded = false;
			let loc = -1;
			arr.forEach((ele, idx) => {
				if (ele == item.name) {
					isSameIncluded = true;
					loc = idx;
				}
			});
			// ?????? ?????? ??????????????? ?????? ??? ??? ?????? ??????
			if (isSameIncluded) {
				arr.splice(loc, 1);
				arr.unshift(item.name);
			}
			// 3?????? ??? ?????? ??? ????????? ?????? ?????? ??????
			else if (arr.length >= 3) {
				arr.pop();
				arr.unshift(item.name);
			}
			// ??? ?????? ?????? ??????
			else {
				arr.unshift(item.name);
			}
			arr = [...arr];
			localStorage.setItem('watched', JSON.stringify(arr));
		}
	};
	//renewWatched(); -> Error: localStorage is not defined

	return (
		<>
			{item && (
				<>
					<DetailTitle>
						<li>{item.name}</li>
					</DetailTitle>
					<DetailContainer>
						{/* <div className='detailTitle'>
				<li>{item.name}</li>
			</div> */}
						<div className='detailBackground'>
							<Wrap>
								<UnderDevSection>
									<Index pageData={pageData} />
								</UnderDevSection>
							</Wrap>
						</div>
					</DetailContainer>
				</>
			)}
		</>
	);
};

export default Detail;

export const getServerSideProps = withGetServerSideProps(async (context) => {
	// const id = context.resolvedUrl

	return {
		props: {},
	};
});

// // //id ??????
// export async function getServerSideProps(context) {
// 	console.log('?????? context', context);
// 	const id = context.params.id;
// 	//const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/museums/${id}`;
// 	//const res = await axios.get(apiUrl);
// 	//const data = res.data;

// 	const item = await Get(['museums', id]);

// 	const pagePath = `detail/${id}`;
// 	const pageTitle = item.name;
// 	const pageDesc = `${item.name}??? ?????? ??????????????????.`;

// 	return {
// 		props: {
// 			//item: data,
// 			...context.props,
// 			pagePath,
// 			pageTitle,
// 			pageDesc,
// 			item,
// 		},
// 	};
// }
