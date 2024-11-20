import React, { useEffect, useState } from "react";
import Heart from "../assets/heart.png";
import Heart_Love from "../assets/heart-red.png";
import {
  FaRegComment,
  FaRegHeart,
  FaRegPaperPlane,
  FaAngleRight,
  FaAngleLeft,
  FaHeart,
} from "react-icons/fa";
import { GoKebabHorizontal } from "react-icons/go";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  HStack,
  VStack,
  Box,
  Input,
  Avatar,
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Textarea,
  background,
  Divider,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import { color } from "framer-motion";
function CardPost(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenReport,
    onOpen: onOpenReport,
    onClose: onCloseReport,
  } = useDisclosure();
  const {
    isOpen: isOpenComment,
    onOpen: onOpenComment,
    onClose: onCloseComment,
  } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteComment,
    onOpen: onOpenDeleteComment,
    onClose: onCloseDeleteComment,
  } = useDisclosure();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [author, setAuthor] = useState("");
  const [ava_author, setAvaAuthor] = useState("");
  const [authorID, setAuthorID] = useState("");
  const [username, setUsername] = useState("");
  const [files, setFile] = useState([]);
  const [comment, setComment] = useState("");
  const [descriptionPost, setDescription] = useState("");
  const [fileLength, setFileLength] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [postID, setPostID] = useState("");
  const [post, setPost] = useState("");
  const [like, setLike] = useState();
  const [likeID, setLikeID] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [reportDetails, setReportDetails] = useState("");
  const [deleteCommentID, setDeleteCommentID] = useState("");
  const [reportCommentID, setReportCommentID] = useState("");

  const fetchVideos = async (postID) => {
    try {
      const response = await axios.get(`http://localhost:1324/files/${postID}`);
      setFile(response.data);
      setFileLength(response.data.length);
      // console.log(response.data.length);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };
  const fetchUser = async (userID) => {
    try {
      const response = await axios.get(`http://localhost:1324/users/${userID}`);
      setAuthor(response.data.name);
      setAvaAuthor(response.data.avatar);
      setUsername(response.data.username);
      setAuthorID(response.data._id);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };
  const fetchLike = async (user, postID) => {
    try {
      const response = await axios.get(
        `http://localhost:1324/likes/${user}/${postID}`
      );

      if (response.data != null) {
        // console.log('Người dùng đã like bài post' + postID);
        setLike(true);
        setLikeID(response.data._id);
      } else {
        // console.log('Người dùng chưa like bài post' + postID);
        setLike(false);
      }
    } catch {
      console.log("Like not found");
    }
  };
  const handleLike = () => {
    const likes = {
      articleID: postID,
      userID: Cookies.get("customerId"),
    };
    axios.post("http://localhost:1324/likes", likes).then((response) => {
      const articlePost = { numberOfLike: post.numberOfLike + 1 };
      axios
        .put(`http://localhost:1324/articles/${postID}`, articlePost)
        .then(() => {
          fetchPost();
          fetchLike(Cookies.get("customerId"), props.postID);
        });

      const notification = {
        user: authorID,
        actor: Cookies.get("customerId"),
        actionDetail: "đã thích bài viết của bạn",
        article: postID,
        like: response.data._id,
      };
      axios.post("http://localhost:1324/notifications", notification);
    });
  };
  const handleDislike = () => {
    const notify = {
      user: authorID,
      actor: Cookies.get("customerId"),
      like: likeID,
    };
    axios.delete("http://localhost:1324/notifications", { data: notify });
    axios.delete(`http://localhost:1324/likes/${likeID}`).then(() => {
      const articlePost = { numberOfLike: post.numberOfLike - 1 };
      axios
        .put(`http://localhost:1324/articles/${postID}`, articlePost)
        .then(() => {
          fetchPost();
          fetchLike(Cookies.get("customerId"), props.postID);
        });
    });
  };
  const fetchPost = async () => {
    const response = await axios.get(
      `http://localhost:1324/articles/all/${postID}`
    );
    setPost(response.data);
  };
  const handleTurnRight = () => {
    const element = document.getElementById(`${postID}width`);
    const computedStyle = window.getComputedStyle(element);
    const width = computedStyle.width;
    if (scrollPosition == fileLength - 1) {
      console.log(scrollPosition);
      document.getElementById(`${postID}`).style.transform = "translateX(0)";
      setScrollPosition(0);
    } else {
      console.log(scrollPosition);
      const updatePossition = scrollPosition + 1;
      document.getElementById(`${postID}`).style.transform = `translateX(${
        updatePossition * -width.split("px")[0]
      }px)`;
      setScrollPosition(updatePossition);
    }
  };
  const handleTurnLeft = () => {
    const element = document.getElementById(`${postID}width`);
    const computedStyle = window.getComputedStyle(element);
    const width = computedStyle.width;
    if (scrollPosition == 0) {
      document.getElementById(`${postID}`).style.transform = `translateX(${
        (fileLength - 1) * -width.split("px")[0]
      }px)`;
      setScrollPosition(fileLength - 1);
    } else {
      const updatePossition = scrollPosition - 1;
      document.getElementById(`${postID}`).style.transform = `translateX(${
        updatePossition * -width.split("px")[0]
      }px)`;
      setScrollPosition(updatePossition);
    }
  };
  const handleComment = (e) => {
    e.preventDefault();
    // enqueueSnackbar('Comment: ' + comment, { variant: 'success' });
    // console.log(Cookies.get('customerId'));
    // console.log(postID);
    if (comment === "") {
      enqueueSnackbar("Chưa nhập bình luận", { variant: "warning" });
    } else if (comment.length > 250) {
      enqueueSnackbar("Độ dài bình luận < 250 ký tự", { variant: "warning" });
    } else {
      const dataComment = {
        articleID: postID,
        userID: Cookies.get("customerId"),
        commentDetail: comment,
      };
      axios
        .post(`http://localhost:1324/comments`, dataComment)
        .then((response) => {
          // console.log(response.data);
          enqueueSnackbar("Bình luận thành công", { variant: "success" });
          setComment("");
          // Cập nhật giá trị số lượng bình luận
          const articlePost = { numberOfComment: post.numberOfComment + 1 };
          axios
            .put(`http://localhost:1324/articles/${postID}`, articlePost)
            .then(() => {
              fetchPost();
              fetchComment(postID);
            });
          // Thêm thông báo
          const notification = {
            user: authorID,
            actor: Cookies.get("customerId"),
            actionDetail: "đã bình luận bài viết của bạn",
            article: postID,
            comment: response.data._id,
          };
          axios
            .post("http://localhost:1324/notifications", notification)
            .then((response) => {
              // console.log(response.data);
            });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  const fetchComment = async (postID) => {
    try {
      const response = await axios.get(
        `http://localhost:1324/comments/${postID}`
      );
      // console.log(response.data.data);
      
        setCommentList(response.data.data);
      
    } catch (error) {
      console.log(error);
    }
  };
  const handleReport = async () => {
    // console.log(Cookies.get('customerId'));
    // console.log(postID);
    try {
      const response = await axios.get(
        `http://localhost:1324/reports/${Cookies.get("customerId")}/${postID}`
      );
      // console.log("Tìm thấy báo cáo");
      enqueueSnackbar("Bài đăng đã được báo cáo", { variant: "warning" });
      onCloseReport();
    } catch (e) {
      if (reportDetails.length > 200) {
        enqueueSnackbar("Mô tả báo cáo có độ dài bé hơn 200 ký tự");
      } else {
        const userID = Cookies.get("customerId");
        // console.log("Không tìm thấy báo cáo");
        const data = {
          postID,
          userID,
          reportDetails,
          reportType: "article",
        };
        axios.post(`http://localhost:1324/reports/`, data).then((response) => {
          // console.log(response.data);
          const newStatus = {
            articleStatus: "reported",
          };
          axios
            .put(`http://localhost:1324/articles/${postID}`, newStatus)
            .then((response) => {
              onCloseReport();
              enqueueSnackbar("Báo cáo bài đăng thành công", {
                variant: "success",
              });
            });
        });
      }
    }
  };
  const handleReportComment = async () => {
    // console.log(Cookies.get('customerId'));
    // console.log(postID);
    try {
      const response = await axios.get(
        `http://localhost:1324/reports/comment/${Cookies.get(
          "customerId"
        )}/${reportCommentID}`
      );
      // console.log("Tìm thấy báo cáo");
      enqueueSnackbar("Bình luận đã được báo cáo", { variant: "warning" });
      onCloseDeleteComment();
      onClose();
    } catch (e) {
      if (reportDetails.length > 200) {
        enqueueSnackbar("Mô tả báo cáo có độ dài bé hơn 200 ký tự");
      } else {
        const userID = Cookies.get("customerId");
        // console.log("Không tìm thấy báo cáo");
        const data = {
          commentID: reportCommentID,
          userID,
          reportDetails,
          reportType: "comment",
        };
        axios.post(`http://localhost:1324/reports/`, data).then((response) => {
          // console.log(response.data);
          const newStatus = {
            commentStatus: "Reported",
          };
          axios
            .put(`http://localhost:1324/comments/${reportCommentID}`, newStatus)
            .then((response) => {
              onCloseDeleteComment();
              onClose();
              enqueueSnackbar("Báo cáo bình luận thành công", {
                variant: "success",
              });
            });
        });
      }
    }
  };
  const setDeleteComment = (commentID) => {
    onOpenComment();
    setDeleteCommentID(commentID);
  };
  const closeDeleteComment = () => {
    onCloseComment();
    setDeleteCommentID("");
  };
  const handleUnComment = (e) => {
    e.preventDefault();
    console.log(deleteCommentID);
    const notify = {
      user: authorID,
      actor: Cookies.get("customerId"),
      comment: deleteCommentID,
    };
    axios.delete("http://localhost:1324/notifications", { data: notify });
    axios
      .delete(`http://localhost:1324/comments/${deleteCommentID}`)
      .then((response) => {
        onCloseComment();
        setDeleteCommentID("");
        const articlePost = { numberOfComment: post.numberOfComment - 1 };
        axios
          .put(`http://localhost:1324/articles/${postID}`, articlePost)
          .then(() => {
            fetchPost();
            fetchComment(postID);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const deletePost = () => {
    axios
      .delete(`http://localhost:1324/articles/${postID}`)
      .then((response) => {
        navigate("/home");
        enqueueSnackbar("Xóa bài đăng thành công", { variant: "success" });
      });
  };
  const reportComment = (commentID) => {
    setReportCommentID(commentID);
    onOpenDeleteComment();
  };
  const closeDeleteCommentReport = () => {
    setDeleteCommentID("");
    onCloseDeleteComment();
  };
  fetchComment(props.postID);
  useEffect(() => {
    fetchVideos(props.postID);
    fetchUser(props.author);
    setDescription(props.description);
    setPostID(props.postID);
    setPost(props.post);
    fetchLike(Cookies.get("customerId"), props.postID);
    fetchComment(props.postID);
  }, []);

  function calculateDaysDifference(publish) {
    // Lấy ngày hiện tại
    const currentDate = new Date();
    const publishDate = new Date(publish);
    // Chuyển cả hai ngày về mốc nửa đêm để tính chỉ số ngày
    const startOfCurrentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      currentDate.getTime()
    );

    const differenceInMilliseconds = Math.abs(currentDate - publishDate);

    // Chuyển đổi mili giây sang giây, phút, và giờ
    const seconds = Math.floor(differenceInMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const remainingSeconds = seconds % 60; // Phần dư giây
    const remainingMinutes = minutes % 60; // Phần dư phút
    if (hours != 0) {
      return hours + " giờ trước";
    } else {
      if (remainingMinutes != 0) {
        return remainingMinutes + " phút trước";
      } else {
        return "Vừa đăng";
      }
    }
  }

  return (
    <>
      <Modal isCentered isOpen={isOpenComment} onClose={closeDeleteComment}>
        <ModalOverlay />
        <ModalContent className="bg-transparent">
          <ModalBody
            className="bg-transparent  text-center"
            p="0"
            onClick={handleUnComment}
          >
            <button
              className="h-full w-full bg-white text-red-500 font-bold py-4 rounded-md
            hover:bg-black hover:text-red-500"
              style={{ boxShadow: "5px 5px 5px black" }}
            >
              Xóa bình luận
            </button>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        size={["xs", "sm", "md", "md"]}
        isCentered
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
      >
        <ModalOverlay />
        <ModalContent className="bg-transparent">
          <ModalBody
            className="bg-transparent  text-center"
            p="0"
            onClick={deletePost}
          >
            <p className="text-md my-4 md:text-lg font-semibold">
              Bạn chắc chắn muốn xóa bài đăng này?
            </p>
            <button
              className="h-full w-full bg-white text-red-500 font-bold py-4 rounded-md text-md md:text-lg
            hover:bg-black hover:text-red-500"
              style={{ boxShadow: "5px 5px 5px black" }}
            >
              Xác nhận xóa
            </button>
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* Modal của Report */}
      <Modal
        isCentered
        isOpen={isOpenReport}
        onClose={onCloseReport}
        size="xl"
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent p="0" borderRadius="md" bg="inherit">
          <ModalHeader
            p="2"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-2xl"
            textAlign="center"
          >
            Report
          </ModalHeader>
          <ModalCloseButton textColor="white" />
          <ModalBody
            p="4"
            className="bg-gradient-to-r from-purple-600 to-pink-600"
          >
            <VStack justifyContent="start">
              <Text
                alignSelf="start"
                textColor="white"
                fontWeight="bold"
                ml="2"
              >
                Người dùng
              </Text>
              <Input value={Cookies.get("customerName")} disabled bg="white" />
              <Text
                alignSelf="start"
                textColor="white"
                fontWeight="bold"
                ml="2"
              >
                Bài đăng
              </Text>
              <Input value={postID} disabled bg="white" />
              <Text
                alignSelf="start"
                textColor="white"
                fontWeight="bold"
                ml="2"
              >
                Báo cáo chi tiết
              </Text>
              <Textarea
                placeholder="Write something"
                bg="white"
                resize="none"
                border="none"
                h="150px"
                className="drop-shadow-xl"
                onChange={(e) => setReportDetails(e.target.value)}
              />
            </VStack>
          </ModalBody>
          <ModalFooter
            display="flex"
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-b-2xl"
            justifyContent="center"
          >
            <Button
              _hover={{ backgroundColor: "black", textColor: "white" }}
              onClick={handleReport}
            >
              Save report
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Modal của Report Comment */}
      <Modal
        isCentered
        isOpen={isOpenDeleteComment}
        onClose={closeDeleteCommentReport}
        size="xl"
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent p="0" borderRadius="md" bg="inherit">
          <ModalHeader
            p="2"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-2xl"
            textAlign="center"
          >
            Report
          </ModalHeader>
          <ModalCloseButton textColor="white" />
          <ModalBody
            p="4"
            className="bg-gradient-to-r from-purple-600 to-pink-600"
          >
            <VStack justifyContent="start">
              <Text
                alignSelf="start"
                textColor="white"
                fontWeight="bold"
                ml="2"
              >
                Người dùng
              </Text>
              <Input value={Cookies.get("customerName")} disabled bg="white" />
              <Text
                alignSelf="start"
                textColor="white"
                fontWeight="bold"
                ml="2"
              >
                Bình luận
              </Text>
              <Input value={reportCommentID} disabled bg="white" />
              <Text
                alignSelf="start"
                textColor="white"
                fontWeight="bold"
                ml="2"
              >
                Báo cáo chi tiết
              </Text>
              <Textarea
                placeholder="Write something"
                bg="white"
                resize="none"
                border="none"
                h="150px"
                className="drop-shadow-xl"
                onChange={(e) => setReportDetails(e.target.value)}
              />
            </VStack>
          </ModalBody>
          <ModalFooter
            display="flex"
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-b-2xl"
            justifyContent="center"
          >
            <Button
              _hover={{ backgroundColor: "black", textColor: "white" }}
              onClick={handleReportComment}
            >
              Save report
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Modal của Bình luận */}
      <Modal
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        size={["md", "lg", "3xl", "6xl"]}
      >
        <ModalOverlay />
        <ModalContent p="0" bg="inherit">
          <ModalHeader className="md:bg-white md:rounded-t-2xl" p="0">
            <Box className="md:flex hidden">
              <Box
                className="w-1/2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-tl-2xl md:text-md "
                p="4"
                textAlign="center"
                textColor="white"
              >
                Post
              </Box>
              <Box
                className="w-1/2 bg-white rounded-tr-2xl border-b-2 border-gray-300 md:text-md "
                textAlign="center"
                textColor="black"
                p="4"
              >
                Comments
              </Box>
            </Box>
            <Box
              className="w-full p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-2xl  md:hidden flex"
              h="100%"
              alignItems="center"
              pl="30px"
              pr="30px"
              pt="10px"
              pb="10px"
            >
              <Avatar
                size={["xs", "sm", "md"]}
                src={`http://localhost:1324/files/download/${ava_author}`}
              />
              <Text
                className="text-black"
                ml="20px"
                textColor="white"
                fontSize={["15px", "sm", "md"]}
              >
                {author}
              </Text>
            </Box>
          </ModalHeader>

          <ModalBody p="0">
            <HStack
              gap="0"
              className="bg-white"
              h={["300px", "350px", "350px"]}
            >
              <Flex
                h={["300px", "100%", "100%"]}
                w="50%"
                className="md:bg-gradient-to-r md:from-purple-600 md:to-pink-600 bg-white items-center"
                style={{ overflow: "hidden" }}
                justifyContent="center"
              >
                <div
                  className="w-auto flex transition duration-500 ease-in-out "
                  id={postID}
                >
                  {files.map((file) =>
                    file.filename.includes(".mp4") ? (
                      <div
                        className="md:w-[448px] md:h-[300px] w-[280px] h-[188px]"
                        style={{ flex: "none" }}
                      >
                        <video
                          className="object-contain w-full h-full"
                          controls
                          key={file._id}
                        >
                          <source
                            src={`http://localhost:1324/files/download/${file._id}`}
                            type="video/mp4"
                          />
                        </video>
                      </div>
                    ) : (
                      <div
                        className="md:w-[448px] md:h-[300px] w-[280px] h-[188px]"
                        style={{ flex: "none" }}
                      >
                        <img
                          className="object-contain w-full h-full"
                          src={`http://localhost:1324/files/download/${file._id}`}
                          key={file._id}
                        />
                      </div>
                    )
                  )}
                </div>
              </Flex>
              <div className="md:hidden block bg-pink-500 w-[1px] h-full"></div>
              <Box
                h={["300px", "350px", "350px"]}
                w="50%"
                overflow="scroll"
                p="4"
                sx={{
                  "&::-webkit-scrollbar": { display: "none" },
                  "-ms-overflow-style": "none", // for Internet Explorer
                  "scrollbar-width": "none", // for Firefox
                }}
              >
                {commentList.map((comment, index) =>
                  comment.userID._id === Cookies.get("customerId") ? (
                    // Bình luận của người dùng
                    <HStack key={index} w="100%" alignItems="start" mt="2">
                      <Avatar
                        size={["xs", "sm", "md"]}
                        src={`http://localhost:1324/files/download/${comment.userID?.avatar}`}
                      />
                      <HStack
                        className="bg-gradient-to-r from-purple-600 to-pink-600"
                        borderRadius="md"
                        p="2"
                        ml="2"
                        w={["75%", "76%", "80%", "87%"]}
                        style={{ boxShadow: "5px 5px 5px black" }}
                      >
                        <VStack
                          className=" text-white"
                          w={["70%", "80%", "85%", "90%"]}
                          alignItems="start"
                        >
                          <Text
                            h="50%"
                            fontWeight="bold"
                            fontSize={["x-small", "sm", "md", "lg"]}
                          >
                            {comment.userID?.name}
                          </Text>
                          <Text
                            h="50%"
                            w="100%"
                            fontSize={["10px", "sm", "md", "lg"]}
                          >
                            {comment.commentDetail}
                          </Text>
                        </VStack>
                        <GoKebabHorizontal
                          className="text-white hover:cursor-pointer"
                          w="10px"
                          h="10px"
                          onClick={() => {
                            setDeleteComment(comment._id);
                          }}
                        />
                      </HStack>
                    </HStack>
                  ) : (
                    // Bình luận của người khác
                    <HStack key={index} w="100%" alignItems="start" mt="2">
                      <Avatar
                        size={["xs", "sm", "md"]}
                        src={`http://localhost:1324/files/download/${comment.userID?.avatar}`}
                      />
                      <HStack
                        className="bg-white border-2 border-black"
                        borderRadius="md"
                        p="2"
                        ml="2"
                        w={["75%", "76%", "80%", "87%"]}
                        style={{ boxShadow: "5px 5px 5px black" }}
                      >
                        <VStack
                          className=" text-black"
                          w={["70%", "80%", "85%", "90%"]}
                          alignItems="start"
                        >
                          <Text
                            h="50%"
                            fontWeight="bold"
                            fontSize={["x-small", "sm", "md", "lg"]}
                          >
                            {comment.userID?.name}
                          </Text>
                          <Text
                            h="50%"
                            w="100%"
                            fontSize={["10px", "sm", "md", "lg"]}
                          >
                            {comment.commentDetail}
                          </Text>
                        </VStack>
                        <GoKebabHorizontal
                          className="text-black hover:cursor-pointer"
                          w="10px"
                          h="10px"
                          onClick={() => reportComment(comment._id)}
                        />
                      </HStack>
                    </HStack>
                  )
                )}
              </Box>
            </HStack>
          </ModalBody>

          <ModalFooter display="flex" p="0" className="rounded-b-2xl h-16">
            <Box
              className="w-1/2 p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-bl-2xl  md:flex hidden"
              h="100%"
              alignItems="center"
              pl="30px"
              pr="30px"
              pt="10px"
              pb="10px"
            >
              <Avatar
                size={["xs", "sm", "md"]}
                src={`http://localhost:1324/files/download/${ava_author}`}
              />
              <Text
                className="text-black"
                ml="20px"
                textColor="white"
                fontSize={["10px", "sm", "md"]}
              >
                {author}
              </Text>
            </Box>
            <Box
              className="bg-white md:w-1/2 w-full md:rounded-br-2xl flex items-center border-t-2 border-gray-300"
              h="100%"
            >
              <form
                onSubmit={handleComment}
                className="flex items-center w-full"
              >
                <Input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-white text-black p-2 rounded-lg mb-0 ml-4 mr-2 border-2 border-black
                  focus:bg-gradient-to-r focus:from-purple-600 focus:to-pink-600 focus:text-white focus:placeholder-white"
                  style={{ boxShadow: "5px 5px 5px black" }}
                  placeholder="Add a comment..."
                  fontSize={["xs", "sm", "md", "md"]}
                />
                <Button
                  type="submit"
                  className="bg-transparent text-black px-4 py-2 font-bold mr-4 rounded-lg border-2 border-black 
                hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white"
                  style={{ boxShadow: "5px 5px 5px black" }}
                  fontSize={["xs", "sm", "md", "md"]}
                >
                  Reply
                </Button>
              </form>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div
        className="bg-black text-white rounded-lg max-w-md mx-auto shadow-2xl md:w-[448px] w-[300px]"
        id={`${postID}width`}
      >
        {/* Header của post */}
        <div className="flex items-center p-4">
          <Avatar
            src={`http://localhost:1324/files/download/${ava_author}`}
            alt={author}
            className="w-10 h-10 rounded-full hover:cursor-pointer"
            onClick={() => navigate(`/users/${authorID}`)}
          />
          <div className="ml-4">
            <h4 className="font-bold text-md md:text-lg">{author}</h4>
            <p className=" text-gray-500 text-sm md:text-md">@{username}</p>
            <p className=" text-gray-500 text-sm md:text-md">
              {calculateDaysDifference(post.publishDate)}
            </p>
          </div>
          <div className="ml-auto">
            <Menu>
              <MenuButton
                as={Button}
                bg="black"
                textColor="white"
                _hover={{ backgroundColor: "black", textColor: "white" }}
                _focus={{ backgroundColor: "black", textColor: "white" }}
                _active={{ backgroundColor: "black", textColor: "white" }}
              >
                •••
              </MenuButton>
              <MenuList bg="black">
                {authorID == Cookies.get("customerId") ? (
                  <MenuItem textColor="red" bg="black" border="black">
                    <Box onClick={onOpenDelete}>Xóa bài đăng</Box>
                  </MenuItem>
                ) : post.articleStatus === "hidden" ? (
                  <MenuItem textColor="red" bg="black" border="black">
                    <Box>Báo cáo</Box>
                  </MenuItem>
                ) : (
                  <MenuItem textColor="red" bg="black" border="black">
                    <Box onClick={onOpenReport}>Báo cáo</Box>
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          </div>
        </div>
        {post.articleStatus === "active" ||
        post.articleStatus === "reported" ? (
          <div>
            <div className="relative" style={{ overflow: "hidden" }}>
              <div
                className="flex transition duration-500 ease-in-out"
                id={postID}
              >
                {files.map((file) =>
                  file.filename.includes(".mp4") ? (
                    <div
                      className="md:w-[448px] md:h-[300px] w-[300px] h-[201px]"
                      style={{ flex: "none" }}
                    >
                      <video
                        className="object-contain w-full h-full"
                        controls
                        key={file._id}
                      >
                        <source
                          src={`http://localhost:1324/files/download/${file._id}`}
                          type="video/mp4"
                        />
                      </video>
                    </div>
                  ) : (
                    <div
                      className="md:w-[448px] md:h-[300px] w-[300px] h-[201px]"
                      style={{ flex: "none" }}
                    >
                      <img
                        className="object-contain w-full h-full"
                        src={`http://localhost:1324/files/download/${file._id}`}
                        key={file._id}
                      />
                    </div>
                  )
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 flex justify-center space-x-2 pb-2">
                {fileLength != 0 ? (
                  files.map((fileCircle, index) =>
                    index == scrollPosition ? (
                      <div
                        className="w-2 h-2 rounded-full bg-white"
                        key={fileCircle._id}
                      ></div>
                    ) : (
                      <div
                        className="w-2 h-2 rounded-full bg-gray-500"
                        key={fileCircle._id}
                      ></div>
                    )
                  )
                ) : (
                  <div className="hidden"></div>
                )}
              </div>
              <div className="absolute inset-y-0 right-0 flex justify-center space-x-2 items-center mr-2">
                <div
                  className="w-6 h-6 rounded-full bg-white bg-opacity-75 flex justify-center items-center hover:ring-2 hover:ring-black"
                  onClick={handleTurnRight}
                >
                  <FaAngleRight className="text-black text-opacity-75 cursor-pointer" />
                </div>
              </div>
              <div className="absolute inset-y-0 flex justify-center space-x-4 items-center ml-2">
                <div
                  className="w-6 h-6 rounded-full bg-white bg-opacity-75 flex justify-center items-center hover:ring-2 hover:ring-black"
                  onClick={handleTurnLeft}
                >
                  <FaAngleLeft className="text-black text-opacity-75 cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="flex justify-between px-4 py-2">
              <div className="flex md:space-x-6 space-x-4">
                {like ? (
                  <FaHeart
                    className="md:w-6 md:h-6 h-4 w-4 cursor-pointer text-red-500 "
                    onClick={handleDislike}
                  />
                ) : (
                  <FaRegHeart
                    className="md:w-6 md:h-6 h-4 w-4 cursor-pointer hover:text-red-500"
                    onClick={handleLike}
                  />
                )}
                <FaRegComment
                  className="md:w-6 md:h-6 h-4 w-4 cursor-pointer hover:text-blue-500 "
                  onClick={onOpen}
                />
                {/* <FaRegPaperPlane className="md:w-6 md:h-6 h-4 w-4 cursor-pointer hover:text-green-500" /> */}
              </div>
            </div>

            <div className="px-4 pb-2 md:text-md ">
              <p className="font-bold ">{post.numberOfLike} likes</p>
            </div>

            <div className="px-4 pb-4">
              <div className="flex gap-2">
                <p className="font-bold md:text-md text-sm">{author} </p>
                <p className="md:text-md text-sm">{descriptionPost}</p>
              </div>
              <Link
                to="#"
                onClick={onOpen}
                className="text-gray-500 md:text-sm text-xs"
              >
                View all {post.numberOfComment} comments
              </Link>
            </div>

            <div className="px-4 pb-4">
              <form onSubmit={handleComment} className="flex items-center">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)} // Cập nhật giá trị bình luận
                  className="w-full bg-gray-800 text-white p-2 rounded-lg mb-0"
                  placeholder="Add a comment..."
                />
                <button
                  type="submit"
                  className="bg-transparent text-white pl-4 font-bold"
                >
                  Reply
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-content text-center">
            {authorID === Cookies.get("customerId") ? (
              <p className="text-center w-full text-red-500 py-4">
                Bài đăng đã bị ẩn vì vi phạm một số nguyên tắc cộng đồng
              </p>
            ) : (
              <p className="text-center w-full text-red-500 py-4">
                Bài đăng hiện không khả dụng
              </p>
            )}
          </div>
        )}
      </div>

      {/* <div className='w-1/2 h-auto bg-white m-auto '>
        <div className='w-full h-auto bg-blue-400 flex'>
        <div className='m-2 h-10 w-10'>
            <img src="https://i.ytimg.com/vi/skluj-DE5xI/maxresdefault.jpg" alt="" className='w-full h-full rounded-full'/>
        </div>
        <div className='flex items-center ml-4'>
            <p>{author}</p>
        </div>
        </div>
        <div className='w-full h-80 bg-black' style={{overflow: 'hidden'}}>
        <div className='flex w-full h-auto items-center transition duration-500 ease-in-out' id='scroll-view'>
            {files.map((file) => (
                file.filename.includes(".mp4") ? (
                    <video className='w-full' autoPlay key={file._id} muted>
                        <source src={`http://localhost:1324/files/download/${file._id}`} type="video/mp4" />
                    </video>
                ) : (
                    <img className='w-full' src={`http://localhost:1324/files/download/${file._id}` } key={file._id}/>
                )
            ))}
            
        </div>
        <div className='flex justify-center w-full'>
            <div className='rounded-full bg-red-400 p-2 mr-4'>Qua phải</div> 
            <div className='rounded-full bg-blue-400 p-2'>Qua trái</div>
        </div>
        </div >
        <div className='w-full h-auto flex items-center mt-2'>
        <img src={imageSrc} width={30} height={30} onClick={handleImage} className='mr-2 ml-2'/>
        <img src={Comment} width={30} height={30}/>
        </div>
        <div className='w-full h-auto flex items-center'>
        <p className='w-full h-auto block p-2'>uilarsgfuiogpfirqefgepgpqieqegpqergpeguiqpuiàafsfasfgpquyofouyfofr</p>
        </div>
        <div className='w-full h-auto flex items-center'>
        <input type="text" className='w-full border-none focus:ring-0 ' placeholder='Add your comment...'/>
        </div>
    </div> */}
    </>
  );
}

export default CardPost;
