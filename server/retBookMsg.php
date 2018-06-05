<?php
	include_once './table_return_book.php';
	if ($_SERVER["REQUEST_METHOD"] =="POST") {
		$fun = $_POST["fun"];
		switch ($fun) {
			case 'retMsgRes':
				$reqUid = $_POST["uid"];
				retMsgRes($reqUid);
				break;
			default:
				# code...
				break;
		}
	}else if($_SERVER['REQUEST_METHOD'] == "GET"){

		$fun = $_GET["fun"];
		switch ($fun) {
			case 'retReq':
				$msg = $_GET["msg"];
				retReq($msg);
				break;
			
			default:
				# code...
				break;
		}
	}


	function retMsgRes($reqUid)
	{
		$obj = new RetBookMsg();
		$return = $obj->find($reqUid);
		$obj->delete($reqUid);
		echo json_encode($return);
	}
	 function retReq($msg)
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
		$obj = new RetBookMsg();
		if($obj->has($reqUid,$resUid,$book_isbn)){
			echo $obj->update($reqUid,$resUid,$book_isbn,$time);
		}else{
			echo $obj->insert($reqUid,$resUid,$book_isbn,$time,$reqNickName,$title,$author,$book_cover);			
		}
		
	}




	
?>