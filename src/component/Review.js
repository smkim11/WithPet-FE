import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { UserContext } from '../context/UserContext';

export default function Review() {
    const title = useParams({});
    const { user } = useContext(UserContext);
    const [review, setReview]= useState({});
    const [reviewList, setReviewList] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(()=>{
            fetch('http://localhost/selectReview?title='+title.title,{method: "get"})
            .then((res)=>(res.json()))
            .then((data)=>{setReviewList(data)})
    },[title.title]);

    // 사진을 업로드하기위해 json방식이 아닌 formData 형식으로 요청
    function insertReview(){
        const formData = new FormData();
        formData.append('userId', user.userId);
        formData.append('title', title.title);
        formData.append('rating', review.rating);
        formData.append('comment', review.comment);
        if (review.file) {
            formData.append('uploadFile', review.file);
        }
        fetch('http://localhost/insertReview',{
            method:"post", body: formData,
        }).then((res)=>{
            if(res.ok){
                alert('등록성공');
                window.location.reload();
            }else{
                console.log(review.file);
                alert('등록실패');
            }

        })
    }
    return (
        <div className="flex flex-col md:flex-row justify-center bg-gray-50 pt-16 pb-8 gap-8 px-4 max-w-7xl mx-auto">
            {/* 리뷰 작성 */}
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full md:w-1/2 border-t-4 border-orange-400">
                <h2 className="text-2xl font-semibold mb-6 border-b pb-2 text-center text-orange-600">리뷰 작성</h2>

                <div className="space-y-5 mb-8">
                    <div className="flex flex-col">
                        <label className="font-medium mb-1">가게</label>
                        <input type="text" value={title.title || ''} readOnly
                            className="border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed" />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium mb-1">이름</label>
                        <input type="text" value={user?.name || ''} readOnly
                            className="border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed" />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium mb-1">평점</label>
                        <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((val) => (
                                <React.Fragment key={val}>
                                    <input
                                        type="radio"
                                        id={`star${val}`}
                                        name="rating"
                                        value={val}
                                        onChange={(e) => setReview({ ...review, rating: e.target.value })}
                                        checked={parseInt(review.rating) === val}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor={`star${val}`}
                                        className={`text-3xl cursor-pointer select-none ${parseInt(review.rating) >= val ? "text-yellow-400" : "text-gray-300"}`}
                                        title={`${val}점`}
                                    >
                                        ★
                                    </label>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium mb-1">리뷰</label>
                        <textarea
                            cols={50}
                            rows={6}
                            onChange={(e) => setReview({ ...review, comment: e.target.value })}
                            className="border border-gray-300 rounded px-3 py-2 resize-none focus:outline-orange-400"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium mb-1">사진</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={(e) => setReview({ ...review, file: e.target.files[0] })}
                        />
                    </div>

                    <button
                        onClick={insertReview}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded px-6 py-2 transition"
                    >
                        작성
                    </button>
                </div>
            </div>

            {/* 리뷰 목록 */}
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full md:w-1/2 border-t-4 border-orange-400 overflow-y-auto max-h-[80vh]">
                <h2 className="text-2xl font-semibold mb-6 border-b pb-2 text-center text-orange-600">리뷰 목록</h2>

                <div className="space-y-6">
                    {reviewList.length === 0 && <p className="text-gray-500">등록된 리뷰가 없습니다.</p>}
                    {reviewList.map((list, idx) => (
                        <div key={idx} className="border rounded p-4 shadow-sm bg-gray-50">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold">{list.name}</span>
                                <span className="text-yellow-400 text-lg">
                                    {'★'.repeat(list.rating)}{'☆'.repeat(5 - list.rating)}
                                </span>
                            </div>
                            {list.file ? (
                                <div className="mb-2">
                                    <img
                                        src={`http://localhost/file/${list.file}`}
                                        alt="리뷰 이미지"
                                        className="w-full max-w-xs rounded cursor-pointer"
                                        onClick={() => setSelectedImage(`http://localhost/file/${list.file}`)}
                                    />
                                </div>
                            ) : null}
                            <p className="whitespace-pre-wrap text-gray-700">{list.comment}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 이미지 모달 */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                    onClick={() => setSelectedImage(null)}  // 바깥 클릭 시 닫기
                >
                    <div className="relative" onClick={e => e.stopPropagation()}>
                        <img src={selectedImage} alt="큰 리뷰 이미지" className="max-w-[60vw] max-h-[60vh] rounded" />
                        <button
                            className="absolute top-2 right-2 text-white bg-gray-800 bg-opacity-70 rounded-full px-3 py-1 text-xl font-bold"
                            onClick={() => setSelectedImage(null)}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
