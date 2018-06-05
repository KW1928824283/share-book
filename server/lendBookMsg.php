<?php
	include_once './table_lend_book.php';
	if ($_SERVER["REQUEST_METHOD"] =="POST") {
		$fun = $_POST["fun"];
		switch ($fun) {
			case 'lendMsgRes':
				$resUid = $_POST["uid"];
				lendMsgRes($resUid);
				break;
			default:
				# code...
				break;
		}
	}else if($_SERVER['REQUEST_METHOD'] == "GET"){

		$fun = $_GET["fun"];
		switch ($fun) {
			case 'lendReq':
				$msg = $_GET["msg"];
				lendReq($msg);
				break;
			
			default:
				# code...
				break;
		}
	}


	function lendMsgRes($resUid)
	{
		$obj = new LendBookMsg();
		$return = $obj->find($resUid);
		$obj->delete($resUid);
		echo json_encode($return);
	}
	 function lendReq($msg)
	{
		
		$msg = json_decode($msg,true);

		$reqUid = $msg["reqUid"];
		$resUid = $msg["resUid"];
		$book_isbn = $msg["book_isbn"];
		$time = $msg["time"];
		$reqNickName = $msg["reqNickName"];
		$title = $msg["title"];
		$author = $msg["author"];
		$book_cover = $msg["book_cover"];
		$obj = new LendBookMsg();
		if($obj->has($reqUid,$resUid,$book_isbn)){
			echo $obj->update($reqUid,$resUid,$book_isbn,$time);
		}else{
			echo $obj->insert($reqUid,$resUid,$book_isbn,$time,$reqNickName,$title,$author,$book_cover);			
		}
		
	}




	
?>