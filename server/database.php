<?php

header("Content-type: text/html; charset=utf-8");

class Database
{
	private $pdo;    
	
	const DBMS = 'mysql';
	const USERNANE = "sujunhao";
	const PASSWORD = 'IUNVbBTLclO2PJ6O';
	const HOST = 'www.chdbwtx.cn';
	const DB = 'mini';

	public function getConnect() 
	{
		$dbms = self::DBMS;
		$userName = self::USERNANE;
		$passWord = self::PASSWORD;
		$host = self::HOST;
		$db = self::DB;
		$options = array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8mb4'); 

		$this->pdo = new PDO("$dbms:dbname=$db;host=$host", $userName, $passWord, $options);

		return $this->pdo ? true : false;
	}


	
	public function query($sql)
	{
		$rows = array();
		$result = $this->pdo->prepare($sql);
		if ($result->execute()) {
			while ($res = $result->fetch(PDO::FETCH_ASSOC)) {
				$rows[] = $res;
			}
		}
		return $rows;
	}

	public function execute($sql)
	{
		return $this->pdo->exec($sql);
	}


	public function isError($ret)
	{
		
		$code = $ret->errorCode();
		return (empty($code) ? true : false);
	}

	public function errorInfo($ret)
	{
		return $ret->errorInfo();
	}
}
