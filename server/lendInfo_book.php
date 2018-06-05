<?php 
	
	include_once './table_book.php';
	include_once './table_lendInfo.php';
	if ($_SERVER["REQUEST_METHOD"] =="POST") {
		$fun = $_POST["fun"];
		switch ($fun) {
			case 'lendInMsg':
				$resUid = $_POST["resUid"];
				lendInMsg($resUid);
				break;
			case 'lendOutMsg':
				$reqUid = $_POST["reqUid"];
				lendOutMsg($reqUid);
				break;
			default:
				# code...
				break;
		}
	}else if($_SERVER['REQUEST_METHOD'] == "GET"){

		$fun = $_GET["fun"];
		switch ($fun) {
			case 'lendBookRes':
				$msg = $_GET['msg'];
				lendBookRes($msg);
				break;
			case 'retBookRes':
				$msg = $_GET["msg"];
				retBookRes($msg);
				break;
			default:
				# code...
				break;
		}
	}
	function retBookRes($msg)
	{
		$msgArr =  json_decode($msg,true);
		$bookObj = new Book();
		$lendInfoObj = new lendInfo();
		$bookRe = $bookObj->updateBookStatus($msgArr["reqUid"],$msgArr["book_isbn"],$msgArr["status"]);
		$infoRe = $lendInfoObj->delete($msgArr["reqUid"] ,$msgArr["resUid"],$msgArr["book_isbn"]);

		$return = array(

				"status"=>true,
				"msg"=>"ok"
		);
		echo json_encode($return);
	}
	function lendOutMsg($reqUid)
	{
		$lendInfoObj = new lendInfo();
		$return = $lendInfoObj->findLendout($reqUid);

		echo json_encode($return);	
	}
	function lendInMsg($resUid)
	{
		$lendInfoObj = new lendInfo();

		$return = $lendInfoObj->findLendin($resUid);
		echo json_encode($return);
	}
	function lendBookRes($msg)
	{
		$msgArr =  json_decode($msg,true);
		$bookObj = new Book();
		$lendInfoObj = new lendInfo();

		$bookRe = $bookObj->updateBookStatus($msgArr["reqUid"],$msgArr["book_isbn"],$msgArr["status"]);
		$infoRe = $lendInfoObj->insert($msg);
		// if (($bookObj->updateBookStatus($msgArr["reqUid"],$msgArr["book_isbn"],$msgArr["status"])) && ($lendInfoObj->insert($msg)) ) 
		if($bookRe && $infoRe){
			$return = array(

				"status"=>true,
				"msg"=>"ok"
			);
			echo json_encode($return);
		}else{
			$bookObj->updateBookStatus($msgArr["reqUid"],$msgArr["book_isbn"],"0");
			$lendInfoObj->delete($msgArr["reqUid"] ,$msgArr["resUid"],$msgArr["book_isbn"]);
			$return = array(
				"status"=>false,
				"msg"=>"err",
				"book" =>$bookRe,
				"info" =>$infoRe

			);
			echo json_encode($return);
		}

	}
 ?>