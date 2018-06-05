<?php
	include_once './TableBook.php';
	include_once './TableBookStatus.php';
	include_once './TableBook_TableBookStatus.php';
	if ($_SERVER["REQUEST_METHOD"] =="POST"){
		$fun = $_POST["fun"];
		switch ($fun) {
			case 'bookInfoStatus':
				$openid = $_POST["openid"];
				bookInfoStatus($openid);
				// echo $openid;
				break;
			
			default:
				# code...
				break;
		}
	}
	function bookInfoStatus($openid)
	{
		
		$bookObj = new Book();
	    $bookLendObj = new BookStatusBook();

	    $bookReturn = $bookObj->findDetailBooksByOpenid($openid);
	    $lendBookInfo = $bookLendObj->findLendBookInfo($openid); 
	    $borrowBookInfo = $bookLendObj->findBorrowInfo($openid);
	   
	    $return = array(
	    	"bookList"=>$bookReturn
	    	,
	    	"lendBookInfo" => $lendBookInfo,
	    	"borrowBookInfo"=>$borrowBookInfo
	    );
	    echo json_encode($return,true);
	}